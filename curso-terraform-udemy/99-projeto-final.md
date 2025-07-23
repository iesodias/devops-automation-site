---
id: 99-projeto-final
title: Lab Final - Projeto Final Terraform - Azure VM Infrastructure
noindex: true
---

# Projeto Final Terraform - Azure VM Infrastructure

## Introdução

Este projeto demonstra o uso avançado do Terraform para criar uma infraestrutura completa no Azure, incluindo VMs Linux, networking, storage, security, monitoring e backup. O projeto abrange as principais funcionalidades do Terraform como variables, locals, outputs, count, providers múltiplos e recursos condicionais.

## Arquitetura

- **Compute**: VMs Linux Ubuntu com discos adicionais
- **Networking**: VNet, Subnets, NSGs, Public IPs
- **Security**: Key Vault, SSH Keys, Application Security Groups
- **Storage**: Storage Account, Managed Disks
- **Monitoring**: Log Analytics, Azure Monitor, Alerts
- **Backup**: Recovery Services Vault (condicional)
- **Automation**: Auto-shutdown para economia de custos

## Pré-requisitos

- Azure CLI instalado e configurado
- Terraform >= 1.5.0
- Conta Azure (free tier funciona)
- Git (opcional)

## Passo a Passo

### 1. Criação da Estrutura do Projeto

```bash
mkdir azure-terraform-vm-project && cd azure-terraform-vm-project
touch {main,variables,locals,outputs,versions,additional-resources}.tf
touch {terraform,dev,prod}.tfvars
touch README.md .gitignore
git init
```

### 2. Configuração do .gitignore

```bash
cat > .gitignore << 'EOF'
*.tfstate
*.tfstate.*
.terraform/
.terraform.lock.hcl
crash.log
override.tf
*.swp
*.pem
*.key
.env
EOF
```

### 3. Criação dos Arquivos Terraform

**main.tf**
```bash
provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
    virtual_machine {
      delete_os_disk_on_deletion     = true
      graceful_shutdown              = false
      skip_shutdown_and_force_delete = false
    }
  }
}

# Data sources para informações existentes
data "azurerm_client_config" "current" {}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = local.resource_group_name
  location = var.location

  tags = local.common_tags
}

# Virtual Network
resource "azurerm_virtual_network" "main" {
  name                = local.vnet_name
  address_space       = [var.vnet_address_space]
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  tags = local.common_tags
}

# Subnets
resource "azurerm_subnet" "web" {
  name                 = local.web_subnet_name
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = [var.web_subnet_address_prefix]
}

resource "azurerm_subnet" "database" {
  name                 = local.db_subnet_name
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = [var.db_subnet_address_prefix]
}

# Network Security Groups
resource "azurerm_network_security_group" "web" {
  name                = local.web_nsg_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  # HTTP
  security_rule {
    name                       = "HTTP"
    priority                   = 1001
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "80"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  # HTTPS
  security_rule {
    name                       = "HTTPS"
    priority                   = 1002
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }

  # SSH
  security_rule {
    name                       = "SSH"
    priority                   = 1003
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = var.ssh_source_address_prefix
    destination_address_prefix = "*"
  }

  tags = local.common_tags
}

# Associate NSG to subnet
resource "azurerm_subnet_network_security_group_association" "web" {
  subnet_id                 = azurerm_subnet.web.id
  network_security_group_id = azurerm_network_security_group.web.id
}

# Public IP
resource "azurerm_public_ip" "main" {
  count               = var.vm_count
  name                = "${local.public_ip_name}-${count.index + 1}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  allocation_method   = "Dynamic"
  domain_name_label   = "${local.dns_prefix}-${count.index + 1}"

  tags = local.common_tags
}

# Load Balancer (quando há mais de uma VM)
resource "azurerm_lb" "main" {
  count               = var.vm_count > 1 ? 1 : 0
  name                = local.lb_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  frontend_ip_configuration {
    name                 = "PublicIPAddress"
    public_ip_address_id = azurerm_public_ip.lb[0].id
  }

  tags = local.common_tags
}

resource "azurerm_public_ip" "lb" {
  count               = var.vm_count > 1 ? 1 : 0
  name                = "${local.public_ip_name}-lb"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  allocation_method   = "Static"
  sku                = "Standard"

  tags = local.common_tags
}

# Network Interface
resource "azurerm_network_interface" "main" {
  count               = var.vm_count
  name                = "${local.nic_name}-${count.index + 1}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.web.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = var.vm_count == 1 ? azurerm_public_ip.main[count.index].id : null
  }

  tags = local.common_tags
}

# Generate SSH key
resource "tls_private_key" "ssh" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

# Storage Account para boot diagnostics
resource "random_id" "storage_suffix" {
  byte_length = 4
}

resource "azurerm_storage_account" "boot_diagnostics" {
  name                     = "${local.storage_account_prefix}${random_id.storage_suffix.hex}"
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  tags = local.common_tags
}

# Key Vault para armazenar secrets
resource "azurerm_key_vault" "main" {
  name                       = local.key_vault_name
  location                   = azurerm_resource_group.main.location
  resource_group_name        = azurerm_resource_group.main.name
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "standard"
  soft_delete_retention_days = 7

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    secret_permissions = [
      "Get", "List", "Set", "Delete", "Purge"
    ]
  }

  tags = local.common_tags
}

# Armazenar chave SSH no Key Vault
resource "azurerm_key_vault_secret" "ssh_private_key" {
  name         = "ssh-private-key"
  value        = tls_private_key.ssh.private_key_pem
  key_vault_id = azurerm_key_vault.main.id

  tags = local.common_tags
}

# Virtual Machines
resource "azurerm_linux_virtual_machine" "main" {
  count                           = var.vm_count
  name                            = "${local.vm_name}-${count.index + 1}"
  location                        = azurerm_resource_group.main.location
  resource_group_name             = azurerm_resource_group.main.name
  size                            = var.vm_size
  admin_username                  = var.admin_username
  disable_password_authentication = true

  network_interface_ids = [
    azurerm_network_interface.main[count.index].id,
  ]

  admin_ssh_key {
    username   = var.admin_username
    public_key = tls_private_key.ssh.public_key_openssh
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = var.os_disk_type
  }

  source_image_reference {
    publisher = var.vm_image.publisher
    offer     = var.vm_image.offer
    sku       = var.vm_image.sku
    version   = var.vm_image.version
  }

  boot_diagnostics {
    storage_account_uri = azurerm_storage_account.boot_diagnostics.primary_blob_endpoint
  }

  depends_on = [
    tls_private_key.ssh,
    azurerm_key_vault_secret.ssh_private_key
  ]

  tags = merge(local.common_tags, {
    Name = "${local.vm_name}-${count.index + 1}"
    Tier = "Web"
  })
}

# Managed Disk adicional para dados
resource "azurerm_managed_disk" "data" {
  count                = var.vm_count
  name                 = "${local.vm_name}-${count.index + 1}-data-disk"
  location             = azurerm_resource_group.main.location
  resource_group_name  = azurerm_resource_group.main.name
  storage_account_type = "Premium_LRS"
  create_option        = "Empty"
  disk_size_gb         = var.data_disk_size_gb

  tags = local.common_tags
}

# Anexar disco de dados às VMs
resource "azurerm_virtual_machine_data_disk_attachment" "data" {
  count              = var.vm_count
  managed_disk_id    = azurerm_managed_disk.data[count.index].id
  virtual_machine_id = azurerm_linux_virtual_machine.main[count.index].id
  lun                = "10"
  caching            = "ReadWrite"
}```

**variables.tf**
```bash
# variables.tf

variable "project_name" {
  description = "Nome do projeto que será usado como prefixo para recursos"
  type        = string
  default     = "webapp"
  
  validation {
    condition     = can(regex("^[a-z0-9]+$", var.project_name))
    error_message = "Project name deve conter apenas letras minúsculas e números."
  }
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
  
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment deve ser: dev, staging, ou prod."
  }
}

variable "location" {
  description = "Azure region onde os recursos serão criados"
  type        = string
  default     = "Brazil South"
  
  validation {
    condition = contains([
      "Brazil South",
      "East US",
      "East US 2",
      "West US",
      "West US 2",
      "Central US",
      "North Central US",
      "South Central US",
      "West Central US",
      "Canada Central",
      "Canada East",
      "West Europe",
      "North Europe",
      "UK South",
      "UK West",
      "France Central",
      "Germany West Central",
      "Switzerland North",
      "Norway East",
      "Sweden Central"
    ], var.location)
    error_message = "Location deve ser uma região Azure válida."
  }
}

variable "vm_count" {
  description = "Número de VMs a serem criadas"
  type        = number
  default     = 1
  
  validation {
    condition     = var.vm_count >= 1 && var.vm_count <= 5
    error_message = "VM count deve estar entre 1 e 5."
  }
}

variable "vm_size" {
  description = "Tamanho da VM"
  type        = string
  default     = "Standard_B2s"
  
  validation {
    condition = contains([
      "Standard_B1s",
      "Standard_B1ms", 
      "Standard_B2s",
      "Standard_B2ms",
      "Standard_B4ms",
      "Standard_D2s_v3",
      "Standard_D4s_v3",
      "Standard_F2s_v2",
      "Standard_F4s_v2"
    ], var.vm_size)
    error_message = "VM size deve ser um dos tamanhos aprovados."
  }
}

variable "admin_username" {
  description = "Nome de usuário administrativo para as VMs"
  type        = string
  default     = "azureuser"
  
  validation {
    condition     = can(regex("^[a-z][a-z0-9]{2,19}$", var.admin_username))
    error_message = "Admin username deve começar com letra minúscula e ter entre 3-20 caracteres."
  }
}

variable "os_disk_type" {
  description = "Tipo do disco do OS"
  type        = string
  default     = "Premium_LRS"
  
  validation {
    condition = contains([
      "Standard_LRS",
      "StandardSSD_LRS", 
      "Premium_LRS"
    ], var.os_disk_type)
    error_message = "OS disk type deve ser: Standard_LRS, StandardSSD_LRS, ou Premium_LRS."
  }
}

variable "data_disk_size_gb" {
  description = "Tamanho do disco de dados em GB"
  type        = number
  default     = 64
  
  validation {
    condition     = var.data_disk_size_gb >= 32 && var.data_disk_size_gb <= 1024
    error_message = "Data disk size deve estar entre 32GB e 1024GB."
  }
}

variable "vnet_address_space" {
  description = "Address space para a VNet"
  type        = string
  default     = "10.0.0.0/16"
  
  validation {
    condition     = can(cidrhost(var.vnet_address_space, 0))
    error_message = "VNet address space deve ser um CIDR válido."
  }
}

variable "web_subnet_address_prefix" {
  description = "Address prefix para a subnet web"
  type        = string
  default     = "10.0.1.0/24"
  
  validation {
    condition     = can(cidrhost(var.web_subnet_address_prefix, 0))
    error_message = "Web subnet address prefix deve ser um CIDR válido."
  }
}

variable "db_subnet_address_prefix" {
  description = "Address prefix para a subnet de banco de dados"
  type        = string
  default     = "10.0.2.0/24"
  
  validation {
    condition     = can(cidrhost(var.db_subnet_address_prefix, 0))
    error_message = "DB subnet address prefix deve ser um CIDR válido."
  }
}

variable "ssh_source_address_prefix" {
  description = "Source address prefix permitido para SSH"
  type        = string
  default     = "*"
  
  validation {
    condition = can(cidrhost(var.ssh_source_address_prefix, 0)) || var.ssh_source_address_prefix == "*"
    error_message = "SSH source address prefix deve ser um CIDR válido ou '*'."
  }
}

variable "vm_image" {
  description = "Imagem da VM"
  type = object({
    publisher = string
    offer     = string
    sku       = string
    version   = string
  })
  default = {
    publisher = "Canonical"
    offer     = "0001-com-ubuntu-server-focal"
    sku       = "20_04-lts-gen2"
    version   = "latest"
  }
}

variable "tags" {
  description = "Tags adicionais para aplicar aos recursos"
  type        = map(string)
  default     = {}
  
  validation {
    condition     = alltrue([for k, v in var.tags : can(regex("^[a-zA-Z0-9_.-]+$", k))])
    error_message = "Tag keys devem conter apenas letras, números, hífens, underscores e pontos."
  }
}

variable "enable_backup" {
  description = "Habilitar backup das VMs"
  type        = bool
  default     = false
}

variable "backup_retention_days" {
  description = "Número de dias para retenção de backup"
  type        = number
  default     = 30
  
  validation {
    condition     = var.backup_retention_days >= 7 && var.backup_retention_days <= 365
    error_message = "Backup retention deve estar entre 7 e 365 dias."
  }
}

variable "enable_monitoring" {
  description = "Habilitar monitoring com Log Analytics"
  type        = bool
  default     = true
}

variable "auto_shutdown_time" {
  description = "Horário para auto shutdown das VMs (formato 24h: HHMM)"
  type        = string
  default     = "1800"
  
  validation {
    condition     = can(regex("^([01]?[0-9]|2[0-3])[0-5][0-9]$", var.auto_shutdown_time))
    error_message = "Auto shutdown time deve estar no formato HHMM (ex: 1800 para 18:00)."
  }
}

variable "auto_shutdown_timezone" {
  description = "Timezone para auto shutdown"
  type        = string
  default     = "E. South America Standard Time"
}

variable "notification_email" {
  description = "Email para receber notificações de auto-shutdown (opcional)"
  type        = string
  default     = ""
  
  validation {
    condition = var.notification_email == "" || can(regex("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", var.notification_email))
    error_message = "Notification email deve ser um email válido ou string vazia."
  }
}

variable "allowed_ssh_cidrs" {
  description = "Lista de CIDRs permitidos para acesso SSH"
  type        = list(string)
  default     = ["0.0.0.0/0"]
  
  validation {
    condition = alltrue([
      for cidr in var.allowed_ssh_cidrs : can(cidrhost(cidr, 0))
    ])
    error_message = "Todos os CIDRs devem ser válidos."
  }
}
```

**locals.tf**
```bash
# locals.tf

locals {
  # Naming conventions
  naming_prefix = "${var.project_name}-${var.environment}"
  
  # Resource names usando naming convention
  resource_group_name    = "${local.naming_prefix}-rg"
  vnet_name             = "${local.naming_prefix}-vnet"
  web_subnet_name       = "${local.naming_prefix}-subnet-web"
  db_subnet_name        = "${local.naming_prefix}-subnet-db"
  web_nsg_name          = "${local.naming_prefix}-nsg-web"
  db_nsg_name           = "${local.naming_prefix}-nsg-db"
  public_ip_name        = "${local.naming_prefix}-pip"
  nic_name              = "${local.naming_prefix}-nic"
  vm_name               = "${local.naming_prefix}-vm"
  lb_name               = "${local.naming_prefix}-lb"
  key_vault_name        = "${local.naming_prefix}-kv-${random_id.storage_suffix.hex}"
  log_analytics_name    = "${local.naming_prefix}-law"
  storage_account_prefix = replace("${var.project_name}${var.environment}diag", "-", "")
  
  # DNS prefix para Public IPs
  dns_prefix = "${var.project_name}${var.environment}${random_id.storage_suffix.hex}"
  
  # Common tags aplicadas a todos os recursos
  common_tags = merge({
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
    CreatedBy   = "TerraformProject"
    CreatedOn   = formatdate("YYYY-MM-DD", timestamp())
    Owner       = "DevOps Team"
    CostCenter  = "IT-Infrastructure"
    Backup      = var.enable_backup ? "Enabled" : "Disabled"
    Monitoring  = var.enable_monitoring ? "Enabled" : "Disabled"
  }, var.tags)
  
  # Network configuration
  network_config = {
    vnet_address_space         = var.vnet_address_space
    web_subnet_address_prefix  = var.web_subnet_address_prefix
    db_subnet_address_prefix   = var.db_subnet_address_prefix
    dns_servers               = ["168.63.129.16"] # Azure DNS
  }
  
  # VM configuration baseada no environment
  vm_config = {
    dev = {
      size                = "Standard_B1s"
      os_disk_type       = "Standard_LRS"
      data_disk_size_gb  = 32
      enable_backup      = false
      auto_shutdown      = true
    }
    staging = {
      size                = "Standard_B2s"
      os_disk_type       = "StandardSSD_LRS"
      data_disk_size_gb  = 64
      enable_backup      = true
      auto_shutdown      = true
    }
    prod = {
      size                = "Standard_D2s_v3"
      os_disk_type       = "Premium_LRS"
      data_disk_size_gb  = 128
      enable_backup      = true
      auto_shutdown      = false
    }
  }
  
  # VM size baseado no environment (override da variável se não especificado)
  effective_vm_size = var.vm_size != "Standard_B2s" ? var.vm_size : local.vm_config[var.environment].size
  effective_os_disk_type = var.os_disk_type != "Premium_LRS" ? var.os_disk_type : local.vm_config[var.environment].os_disk_type
  effective_data_disk_size = var.data_disk_size_gb != 64 ? var.data_disk_size_gb : local.vm_config[var.environment].data_disk_size_gb
  
  # Security rules dinâmicas
  web_security_rules = [
    {
      name                       = "HTTP"
      priority                   = 1001
      direction                  = "Inbound"
      access                     = "Allow"
      protocol                   = "Tcp"
      source_port_range          = "*"
      destination_port_range     = "80"
      source_address_prefix      = "*"
      destination_address_prefix = "*"
    },
    {
      name                       = "HTTPS"
      priority                   = 1002
      direction                  = "Inbound"
      access                     = "Allow"
      protocol                   = "Tcp"
      source_port_range          = "*"
      destination_port_range     = "443"
      source_address_prefix      = "*"
      destination_address_prefix = "*"
    }
  ]
  
  # SSH rules para cada CIDR permitido
  ssh_security_rules = [
    for i, cidr in var.allowed_ssh_cidrs : {
      name                       = "SSH-${i + 1}"
      priority                   = 1100 + i
      direction                  = "Inbound"
      access                     = "Allow"
      protocol                   = "Tcp"
      source_port_range          = "*"
      destination_port_range     = "22"
      source_address_prefix      = cidr
      destination_address_prefix = "*"
    }
  ]
  
  # Todas as security rules combinadas
  all_security_rules = concat(local.web_security_rules, local.ssh_security_rules)
  
  # Configuração de backup
  backup_config = var.enable_backup ? {
    policy_name           = "${local.naming_prefix}-backup-policy"
    vault_name           = "${local.naming_prefix}-rsv"
    retention_daily      = var.backup_retention_days
    retention_weekly     = 4
    retention_monthly    = 12
    retention_yearly     = 1
    backup_time         = "23:00"
    backup_timezone     = var.auto_shutdown_timezone
  } : null
  
  # Monitoring configuration
  monitoring_config = var.enable_monitoring ? {
    workspace_name       = local.log_analytics_name
    retention_days      = 30
    sku                 = "PerGB2018"
    solutions = [
      "VMInsights",
      "Security",
      "Updates"
    ]
  } : null
  
  # Auto-shutdown configuration
  auto_shutdown_config = {
    enabled          = local.vm_config[var.environment].auto_shutdown
    time            = var.auto_shutdown_time
    timezone        = var.auto_shutdown_timezone
    notification_settings = {
      enabled         = true
      time_in_minutes = 30
      webhook_url     = ""
      email_recipient = ""
    }
  }
  
  # Conditional resources flags
  should_create_load_balancer = var.vm_count > 1
  should_create_backup = var.enable_backup && local.vm_config[var.environment].enable_backup
  should_create_monitoring = var.enable_monitoring
  should_enable_auto_shutdown = local.auto_shutdown_config.enabled
  
  # Location mapping para short names
  location_short = {
    "Brazil South"              = "brs"
    "East US"                   = "eus"
    "East US 2"                 = "eus2"
    "West US"                   = "wus"
    "West US 2"                 = "wus2"
    "Central US"                = "cus"
    "North Central US"          = "ncus"
    "South Central US"          = "scus"
    "West Central US"           = "wcus"
    "Canada Central"            = "cac"
    "Canada East"               = "cae"
    "West Europe"               = "weu"
    "North Europe"              = "neu"
    "UK South"                  = "uks"
    "UK West"                   = "ukw"
    "France Central"            = "frc"
    "Germany West Central"      = "gwc"
    "Switzerland North"         = "swn"
    "Norway East"               = "noe"
    "Sweden Central"            = "sec"
  }
  
  # Resource naming com location
  location_suffix = lookup(local.location_short, var.location, "unknown")
  
  # Advanced naming com location
  advanced_naming = {
    resource_group    = "${local.naming_prefix}-${local.location_suffix}-rg"
    storage_account   = lower(replace("${var.project_name}${var.environment}${local.location_suffix}sa${random_id.storage_suffix.hex}", "-", ""))
    key_vault        = "${local.naming_prefix}-${local.location_suffix}-kv"
  }
  
  # Network ACLs
  network_acls = {
    default_action = "Deny"
    ip_rules = var.environment == "prod" ? [] : ["0.0.0.0/0"]
    virtual_network_subnet_ids = [
      # Será preenchido após criação das subnets
    ]
  }
}
```

**outputs.tf**
```bash
# outputs.tf

# Resource Group information
output "resource_group_name" {
  description = "Nome do Resource Group criado"
  value       = azurerm_resource_group.main.name
}

output "resource_group_location" {
  description = "Localização do Resource Group"
  value       = azurerm_resource_group.main.location
}

output "resource_group_id" {
  description = "ID do Resource Group"
  value       = azurerm_resource_group.main.id
}

# Network information
output "virtual_network_name" {
  description = "Nome da Virtual Network"
  value       = azurerm_virtual_network.main.name
}

output "virtual_network_id" {
  description = "ID da Virtual Network"
  value       = azurerm_virtual_network.main.id
}

output "virtual_network_address_space" {
  description = "Address space da Virtual Network"
  value       = azurerm_virtual_network.main.address_space
}

output "web_subnet_id" {
  description = "ID da subnet web"
  value       = azurerm_subnet.web.id
}

output "database_subnet_id" {
  description = "ID da subnet database"
  value       = azurerm_subnet.database.id
}

# VM information
output "vm_names" {
  description = "Nomes das VMs criadas"
  value       = azurerm_linux_virtual_machine.main[*].name
}

output "vm_ids" {
  description = "IDs das VMs criadas"
  value       = azurerm_linux_virtual_machine.main[*].id
}

output "vm_private_ip_addresses" {
  description = "Endereços IP privados das VMs"
  value = [
    for nic in azurerm_network_interface.main :
    nic.ip_configuration[0].private_ip_address
  ]
}

output "vm_public_ip_addresses" {
  description = "Endereços IP públicos das VMs"
  value = [
    for pip in azurerm_public_ip.main :
    pip.ip_address
  ]
}

output "vm_fqdns" {
  description = "FQDNs das VMs"
  value = [
    for pip in azurerm_public_ip.main :
    pip.fqdn
  ]
}

# Load Balancer information (quando aplicável)
output "load_balancer_public_ip" {
  description = "IP público do Load Balancer"
  value       = var.vm_count > 1 ? azurerm_public_ip.lb[0].ip_address : null
}

output "load_balancer_fqdn" {
  description = "FQDN do Load Balancer"
  value       = var.vm_count > 1 ? azurerm_public_ip.lb[0].fqdn : null
}

# SSH Key information
output "ssh_private_key_pem" {
  description = "Chave SSH privada em formato PEM"
  value       = tls_private_key.ssh.private_key_pem
  sensitive   = true
}

output "ssh_public_key" {
  description = "Chave SSH pública"
  value       = tls_private_key.ssh.public_key_openssh
}

# Storage Account information
output "boot_diagnostics_storage_account_name" {
  description = "Nome da Storage Account para boot diagnostics"
  value       = azurerm_storage_account.boot_diagnostics.name
}

output "boot_diagnostics_storage_account_primary_endpoint" {
  description = "Endpoint primário da Storage Account"
  value       = azurerm_storage_account.boot_diagnostics.primary_blob_endpoint
}

# Key Vault information
output "key_vault_name" {
  description = "Nome do Key Vault"
  value       = azurerm_key_vault.main.name
}

output "key_vault_uri" {
  description = "URI do Key Vault"
  value       = azurerm_key_vault.main.vault_uri
}

# Data disk information
output "data_disk_names" {
  description = "Nomes dos discos de dados"
  value       = azurerm_managed_disk.data[*].name
}

output "data_disk_sizes" {
  description = "Tamanhos dos discos de dados em GB"
  value       = azurerm_managed_disk.data[*].disk_size_gb
}

# Network Security Group information
output "web_nsg_id" {
  description = "ID do Network Security Group web"
  value       = azurerm_network_security_group.web.id
}

output "web_nsg_security_rules" {
  description = "Regras de segurança do NSG web"
  value = [
    for rule in azurerm_network_security_group.web.security_rule :
    {
      name                   = rule.name
      priority               = rule.priority
      direction              = rule.direction
      access                 = rule.access
      protocol               = rule.protocol
      destination_port_range = rule.destination_port_range
    }
  ]
}

# Summary information
output "deployment_summary" {
  description = "Resumo do deployment"
  value = {
    project_name          = var.project_name
    environment           = var.environment
    location              = var.location
    vm_count              = var.vm_count
    vm_size               = local.effective_vm_size
    resource_group        = azurerm_resource_group.main.name
    virtual_network       = azurerm_virtual_network.main.name
    load_balancer_enabled = var.vm_count > 1
    backup_enabled        = var.enable_backup
    monitoring_enabled    = var.enable_monitoring
    total_data_disk_gb    = sum(azurerm_managed_disk.data[*].disk_size_gb)
    creation_date         = formatdate("YYYY-MM-DD hh:mm:ss ZZZ", timestamp())
  }
}

# Cost estimation helper
output "cost_estimation_info" {
  description = "Informações para estimativa de custos"
  value = {
    region = var.location
    vms = [
      for i in range(var.vm_count) : {
        name           = azurerm_linux_virtual_machine.main[i].name
        size           = azurerm_linux_virtual_machine.main[i].size
        os_disk_type   = azurerm_linux_virtual_machine.main[i].os_disk[0].storage_account_type
        data_disk_type = azurerm_managed_disk.data[i].storage_account_type
        data_disk_size = azurerm_managed_disk.data[i].disk_size_gb
      }
    ]
    storage_accounts = [
      {
        name         = azurerm_storage_account.boot_diagnostics.name
        account_tier = azurerm_storage_account.boot_diagnostics.account_tier
        replication  = azurerm_storage_account.boot_diagnostics.account_replication_type
      }
    ]
    public_ips    = length(azurerm_public_ip.main) + (var.vm_count > 1 ? 1 : 0)
    load_balancer = var.vm_count > 1
  }
}

# Connection information
output "connection_info" {
  description = "Informações de conexão SSH"
  value = {
    username = var.admin_username
    ssh_command = var.vm_count == 1 ? [
      "ssh -i private_key.pem ${var.admin_username}@${azurerm_public_ip.main[0].ip_address}"
      ] : [
      for i, pip in azurerm_public_ip.main :
      "ssh -i private_key.pem ${var.admin_username}@${pip.ip_address} # VM ${i + 1}"
    ]
  }
}

# DNS information
output "dns_information" {
  description = "Informações de DNS"
  value = {
    public_dns_names = [
      for pip in azurerm_public_ip.main :
      pip.fqdn if pip.fqdn != null
    ]
    load_balancer_dns = var.vm_count > 1 ? azurerm_public_ip.lb[0].fqdn : null
  }
}
```

**versions.tf**
```bash
# versions.tf
# Configurações de versão e provider requirements

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.85"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
    time = {
      source  = "hashicorp/time"
      version = "~> 0.10"
    }
    null = {
      source  = "hashicorp/null"
      version = "~> 3.2"
    }

  }

  # Configuração do backend (descomente se usar remote state)
  # backend "azurerm" {
  #   resource_group_name  = "terraform-state-rg"
  #   storage_account_name = "terraformstatexxxxxx"
  #   container_name       = "tfstate"
  #   key                  = "webapp-dev.tfstate"
  # }
}
```

**additional-resources.tf**
```bash
# additional-resources.tf
# Recursos adicionais para demonstrar funcionalidades avançadas do Terraform

# Log Analytics Workspace (condicional)
resource "azurerm_log_analytics_workspace" "main" {
  count               = var.enable_monitoring ? 1 : 0
  name                = local.log_analytics_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "PerGB2018"
  retention_in_days   = 30

  tags = local.common_tags
}

# VM Extension para Log Analytics Agent
resource "azurerm_virtual_machine_extension" "log_analytics" {
  count                = var.enable_monitoring ? var.vm_count : 0
  name                 = "OmsAgentForLinux"
  virtual_machine_id   = azurerm_linux_virtual_machine.main[count.index].id
  publisher            = "Microsoft.EnterpriseCloud.Monitoring"
  type                 = "OmsAgentForLinux"
  type_handler_version = "1.13"

  settings = jsonencode({
    workspaceId = azurerm_log_analytics_workspace.main[0].workspace_id
  })

  protected_settings = jsonencode({
    workspaceKey = azurerm_log_analytics_workspace.main[0].primary_shared_key
  })

  tags = local.common_tags
}

# Recovery Services Vault (condicional)
resource "azurerm_recovery_services_vault" "main" {
  count               = var.enable_backup ? 1 : 0
  name                = "${local.naming_prefix}-rsv"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "Standard"
  soft_delete_enabled = true

  tags = local.common_tags
}

# Backup Policy
resource "azurerm_backup_policy_vm" "main" {
  count               = var.enable_backup ? 1 : 0
  name                = "${local.naming_prefix}-backup-policy"
  resource_group_name = azurerm_resource_group.main.name
  recovery_vault_name = azurerm_recovery_services_vault.main[0].name

  backup {
    frequency = "Daily"
    time      = "23:00"
  }

  retention_daily {
    count = var.backup_retention_days
  }

  retention_weekly {
    count    = 4
    weekdays = ["Sunday"]
  }

  retention_monthly {
    count    = 12
    weekdays = ["Sunday"]
    weeks    = ["First"]
  }
}

# Protected VM (Backup)
resource "azurerm_backup_protected_vm" "main" {
  count               = var.enable_backup ? var.vm_count : 0
  resource_group_name = azurerm_resource_group.main.name
  recovery_vault_name = azurerm_recovery_services_vault.main[0].name
  source_vm_id        = azurerm_linux_virtual_machine.main[count.index].id
  backup_policy_id    = azurerm_backup_policy_vm.main[0].id
}

# Auto-shutdown schedule para VMs
resource "azurerm_dev_test_global_vm_shutdown_schedule" "main" {
  count              = local.should_enable_auto_shutdown ? var.vm_count : 0
  virtual_machine_id = azurerm_linux_virtual_machine.main[count.index].id
  location           = azurerm_resource_group.main.location
  enabled            = true

  daily_recurrence_time = var.auto_shutdown_time
  timezone              = var.auto_shutdown_timezone

  # notification_settings é obrigatório - desabilitado se não houver email
  notification_settings {
    enabled         = var.notification_email != ""
    time_in_minutes = 30
    email           = var.notification_email != "" ? var.notification_email : "noreply@example.com"
  }

  tags = local.common_tags
}

# Application Security Group
resource "azurerm_application_security_group" "web" {
  name                = "${local.naming_prefix}-asg-web"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  tags = local.common_tags
}

# Associate NICs with ASG
resource "azurerm_network_interface_application_security_group_association" "web" {
  count                         = var.vm_count
  network_interface_id          = azurerm_network_interface.main[count.index].id
  application_security_group_id = azurerm_application_security_group.web.id
}

# Azure Monitor Action Group
resource "azurerm_monitor_action_group" "main" {
  count               = var.enable_monitoring ? 1 : 0
  name                = "${local.naming_prefix}-actiongroup"
  resource_group_name = azurerm_resource_group.main.name
  short_name          = "webapp-ag"

  email_receiver {
    name          = "admin"
    email_address = "admin@empresa.com.br" # Substitua por um email real
  }

  tags = local.common_tags
}

# Metric Alert para CPU alta
resource "azurerm_monitor_metric_alert" "cpu_high" {
  count               = var.enable_monitoring ? var.vm_count : 0
  name                = "${azurerm_linux_virtual_machine.main[count.index].name}-cpu-alert"
  resource_group_name = azurerm_resource_group.main.name
  scopes              = [azurerm_linux_virtual_machine.main[count.index].id]
  description         = "Alert when CPU usage is over 80%"
  severity            = 2

  criteria {
    metric_namespace = "Microsoft.Compute/virtualMachines"
    metric_name      = "Percentage CPU"
    aggregation      = "Average"
    operator         = "GreaterThan"
    threshold        = 80
  }

  action {
    action_group_id = azurerm_monitor_action_group.main[0].id
  }

  tags = local.common_tags
}

# Availability Set para VMs (quando há múltiplas VMs)
resource "azurerm_availability_set" "main" {
  count                        = var.vm_count > 1 ? 1 : 0
  name                         = "${local.naming_prefix}-avset"
  location                     = azurerm_resource_group.main.location
  resource_group_name          = azurerm_resource_group.main.name
  platform_fault_domain_count  = 2
  platform_update_domain_count = 2
  managed                      = true

  tags = local.common_tags
}

# Private DNS Zone para resolução interna
resource "azurerm_private_dns_zone" "main" {
  name                = "${var.project_name}.local"
  resource_group_name = azurerm_resource_group.main.name

  tags = local.common_tags
}

# Link da Private DNS Zone com a VNet
resource "azurerm_private_dns_zone_virtual_network_link" "main" {
  name                  = "${local.naming_prefix}-dns-link"
  resource_group_name   = azurerm_resource_group.main.name
  private_dns_zone_name = azurerm_private_dns_zone.main.name
  virtual_network_id    = azurerm_virtual_network.main.id
  registration_enabled  = true

  tags = local.common_tags
}
```

### 4. Configuração dos Ambientes

**terraform.tfvars**
```bash
# terraform.tfvars
# Configuração principal do projeto

# Informações do projeto
project_name = "webapp"
environment  = "dev"
location     = "Brazil South"

# Configuração das VMs
vm_count          = 2
vm_size           = "Standard_B2s"
admin_username    = "azureuser"
os_disk_type      = "Premium_LRS"
data_disk_size_gb = 64

# Configuração de rede
vnet_address_space        = "10.0.0.0/16"
web_subnet_address_prefix = "10.0.1.0/24"
db_subnet_address_prefix  = "10.0.2.0/24"
ssh_source_address_prefix = "*"

# Lista de CIDRs permitidos para SSH (mais seguro que o source_address_prefix)
allowed_ssh_cidrs = [
  "0.0.0.0/0" # Substitua pelo seu IP ou range corporativo
  # "201.123.45.0/24",  # Exemplo: range corporativo
  # "10.0.0.0/8"        # Exemplo: rede interna
]

# Imagem da VM
vm_image = {
  publisher = "Canonical"
  offer     = "0001-com-ubuntu-server-focal"
  sku       = "20_04-lts-gen2"
  version   = "latest"
}

# Configurações opcionais
enable_backup         = true
backup_retention_days = 30
enable_monitoring     = true

# Auto-shutdown para economizar custos em dev
auto_shutdown_time     = "1900" # 19:00
auto_shutdown_timezone = "E. South America Standard Time"

# Email para notificações (opcional - deixe vazio se não quiser notificações)
notification_email = "" # Exemplo: "seuemail@dominio.com"

# Tags personalizadas
tags = {
  Owner      = "DevOps Team"
  CostCenter = "TI-Infraestrutura"
  Project    = "Projeto Final Terraform"
  Course     = "Udemy Terraform"
  Student    = "Seu Nome Aqui"
  Purpose    = "Learning"
  Department = "Engineering"
}
```

**dev.tfvars**
```bash
# dev.tfvars
# Configuração específica para ambiente de desenvolvimento

project_name = "webapp"
environment  = "dev"
location     = "Brazil South"

# VMs menores para dev
vm_count          = 1
vm_size           = "Standard_B1s"
admin_username    = "azureuser"
os_disk_type      = "Standard_LRS"
data_disk_size_gb = 32

# Rede simplificada
vnet_address_space        = "10.10.0.0/16"
web_subnet_address_prefix = "10.10.1.0/24"
db_subnet_address_prefix  = "10.10.2.0/24"

# Segurança relaxada para dev
ssh_source_address_prefix = "*"
allowed_ssh_cidrs         = ["0.0.0.0/0"]

# Imagem Ubuntu LTS
vm_image = {
  publisher = "Canonical"
  offer     = "0001-com-ubuntu-server-focal"
  sku       = "20_04-lts-gen2"
  version   = "latest"
}

# Features desabilitadas para economizar custos
enable_backup     = false
enable_monitoring = false

# Auto-shutdown habilitado
auto_shutdown_time     = "1800" # 18:00
auto_shutdown_timezone = "E. South America Standard Time"

# Email para notificações (opcional)
notification_email = "" # Deixe vazio para sem notificações

# Tags de desenvolvimento
tags = {
  Owner       = "Developer"
  CostCenter  = "R&D"
  Environment = "Development"
  AutoDelete  = "true"
  Purpose     = "Learning"
  Course      = "Terraform Udemy"
}
```

**prod.tfvars**
```bash
# prod.tfvars
# Configuração específica para ambiente de produção

project_name = "webapp"
environment  = "prod"
location     = "Brazil South"

# VMs robustas para produção
vm_count          = 3
vm_size           = "Standard_D2s_v3"
admin_username    = "prodadmin"
os_disk_type      = "Premium_LRS"
data_disk_size_gb = 128

# Rede segmentada
vnet_address_space        = "10.0.0.0/16"
web_subnet_address_prefix = "10.0.1.0/24"
db_subnet_address_prefix  = "10.0.2.0/24"

# Segurança restrita - substitua pelos IPs da sua organização
ssh_source_address_prefix = "203.0.113.0/24" # Substitua pelo range corporativo
allowed_ssh_cidrs = [
  "203.0.113.0/24", # Range corporativo
  "198.51.100.0/24" # VPN range
]

# Imagem Ubuntu LTS
vm_image = {
  publisher = "Canonical"
  offer     = "0001-com-ubuntu-server-focal"
  sku       = "20_04-lts-gen2"
  version   = "latest"
}

# Features completas para produção
enable_backup         = true
backup_retention_days = 90
enable_monitoring     = true

# Sem auto-shutdown em produção
auto_shutdown_time     = "0000" # Desabilitado
auto_shutdown_timezone = "E. South America Standard Time"

# Tags de produção
tags = {
  Owner        = "Operations Team"
  CostCenter   = "Production"
  Environment  = "Production"
  Criticality  = "High"
  BackupPolicy = "Daily"
  Monitoring   = "24x7"
  Compliance   = "Required"
  DataClass    = "Confidential"
}
```

### 5. Configuração do Azure

```bash
az login
az account list --output table
az account set --subscription "sua-subscription-id"
az account show
export ARM_SUBSCRIPTION_ID="sua-subscription-id"
```

### 6. Inicialização e Deploy

```bash
terraform init
terraform validate
terraform fmt
terraform plan -var-file="dev.tfvars"
terraform apply -var-file="dev.tfvars"
```

### 7. Verificação dos Recursos

```bash
terraform output
az resource list --resource-group $(terraform output -raw resource_group_name) --output table
az vm list --resource-group $(terraform output -raw resource_group_name) --output table
```

### 8. Teste de Conectividade SSH

```bash
VM_IP=$(az network public-ip show --resource-group $(terraform output -raw resource_group_name) --name webapp-dev-pip-1 --query ipAddress -o tsv)
terraform output -raw ssh_private_key_pem > private_key.pem
chmod 600 private_key.pem
ssh -i private_key.pem azureuser@$VM_IP
```

### 9. Testes Práticos (Dentro da VM)

```bash
uname -a
df -h
lsblk
sudo apt update
sudo apt install -y nginx
sudo systemctl start nginx
curl localhost
```

### 10. Verificação de Custos

```bash
az consumption usage list --output table
echo "Monitorar custos em: https://portal.azure.com/#blade/Microsoft_Azure_CostManagement/Menu/overview"
```

### 11. Limpeza dos Recursos

```bash
terraform destroy -var-file="dev.tfvars" -auto-approve
az group list --output table
```

## 🎯 Funcionalidades Demonstradas

- ✅ Variables tipadas com validação
- ✅ Locals com lógica complexa
- ✅ Outputs informativos
- ✅ Count para múltiplos recursos
- ✅ Providers múltiplos (azurerm, random, tls)
- ✅ Recursos condicionais (backup, monitoring)
- ✅ Dynamic blocks
- ✅ Data sources
- ✅ Key Vault para secrets
- ✅ Auto-shutdown para economia
- ✅ Tags organizacionais
- ✅ Network Security Groups
- ✅ Managed Disks

## 💰 Estimativa de Custos

**Desenvolvimento**: ~$8-15 USD/mês (com auto-shutdown)
**Produção**: ~$390-515 USD/mês (3 VMs com backup e monitoring)

## 🏆 Resultado Final

Uma infraestrutura completa e profissional que demonstra domínio avançado do Terraform, seguindo boas práticas de IaC, segurança e gestão de custos.