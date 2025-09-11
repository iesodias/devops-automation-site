---
id: 99-projeto-final-fala
title: Lab Final - Guia de Explicação para Gravação - Azure VM Infrastructure
noindex: true
---

# Projeto Final Terraform - Guia de Explicação com Comentários nos Resources

## versions.tf

```hcl
# Este bloco define as versões mínimas do Terraform e dos providers necessários
# É fundamental para garantir compatibilidade e evitar breaking changes
terraform {
  required_version = ">= 1.5.0"

  required_providers {
    # Provider oficial do Azure - permite criar recursos no Azure
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.85"
    }
    # Provider para gerar valores aleatórios - usado para nomes únicos de storage
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
    # Provider para gerar chaves SSH automaticamente
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }
    # Provider para recursos baseados em tempo
    time = {
      source  = "hashicorp/time"
      version = "~> 0.10"
    }
    # Provider para recursos null (usado para triggers e dependências)
    null = {
      source  = "hashicorp/null"
      version = "~> 3.2"
    }
  }
}
```

## main.tf

```hcl
# Configuração do provider Azure com features específicas para nosso ambiente
# Essas configurações controlam comportamentos padrão do provider
provider "azurerm" {
  features {
    resource_group {
      # Permite deletar resource group mesmo se contiver recursos (útil para labs)
      prevent_deletion_if_contains_resources = false
    }
    virtual_machine {
      # Remove discos automaticamente quando VM é deletada (evita custos extras)
      delete_os_disk_on_deletion     = true
      graceful_shutdown              = false
      skip_shutdown_and_force_delete = false
    }
  }
}

# Data source que obtém informações da sessão atual do Azure CLI
# Usado para pegar tenant_id, subscription_id e object_id automaticamente
data "azurerm_client_config" "current" {}

# Resource Group - container lógico que agrupa todos os recursos relacionados
# Facilita organização, billing e aplicação de políticas
resource "azurerm_resource_group" "main" {
  name     = local.resource_group_name
  location = var.location

  tags = local.common_tags
}

# Virtual Network - rede privada virtual no Azure
# Define o espaço de endereços IP que nossa infraestrutura pode usar
resource "azurerm_virtual_network" "main" {
  name                = local.vnet_name
  address_space       = [var.vnet_address_space]
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  tags = local.common_tags
}

# Subnet para servidores web - segmenta a rede para melhor segurança
# Servidores web ficam isolados em sua própria subnet
resource "azurerm_subnet" "web" {
  name                 = local.web_subnet_name
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = [var.web_subnet_address_prefix]
}

# Subnet para banco de dados - isolamento adicional para dados sensíveis
# Banco de dados fica em subnet separada com regras de firewall específicas
resource "azurerm_subnet" "database" {
  name                 = local.db_subnet_name
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = [var.db_subnet_address_prefix]
}

# Network Security Group para subnet web - funciona como firewall de rede
# Define regras de tráfego permitido/negado para a subnet web
resource "azurerm_network_security_group" "web" {
  name                = local.web_nsg_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  # Regra para permitir tráfego HTTP na porta 80
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

  # Regra para permitir tráfego HTTPS na porta 443
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

  # Regra para permitir SSH na porta 22 - restrita por IP de origem
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

# Associação do NSG com a subnet web - aplica as regras de firewall à subnet
resource "azurerm_subnet_network_security_group_association" "web" {
  subnet_id                 = azurerm_subnet.web.id
  network_security_group_id = azurerm_network_security_group.web.id
}

# Public IPs para as VMs - usando count para criar múltiplos IPs
# Cada VM terá seu próprio IP público para acesso direto
resource "azurerm_public_ip" "main" {
  count               = var.vm_count
  name                = "${local.public_ip_name}-${count.index + 1}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  allocation_method   = "Dynamic"
  domain_name_label   = "${local.dns_prefix}-${count.index + 1}"

  tags = local.common_tags
}

# Load Balancer - recurso condicional criado apenas se há múltiplas VMs
# Distribui tráfego entre as VMs para alta disponibilidade
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

# Public IP para o Load Balancer - IP estático para o LB
resource "azurerm_public_ip" "lb" {
  count               = var.vm_count > 1 ? 1 : 0
  name                = "${local.public_ip_name}-lb"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  allocation_method   = "Static"
  sku                = "Standard"

  tags = local.common_tags
}

# Network Interfaces para as VMs - conecta VMs à rede
# Cada VM precisa de sua própria interface de rede
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

# Geração automática de chave SSH - cria par de chaves seguro
# RSA 4096 bits para máxima segurança de acesso às VMs
resource "tls_private_key" "ssh" {
  algorithm = "RSA"
  rsa_bits  = 4096
}

# ID aleatório para garantir nome único da storage account
# Storage accounts precisam ter nomes globalmente únicos no Azure
resource "random_id" "storage_suffix" {
  byte_length = 4
}

# Storage Account para boot diagnostics das VMs
# Permite ver console e screenshots das VMs para troubleshooting
resource "azurerm_storage_account" "boot_diagnostics" {
  name                     = "${local.storage_account_prefix}${random_id.storage_suffix.hex}"
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  tags = local.common_tags
}

# Key Vault para armazenar secrets de forma segura
# Centraliza gerenciamento de chaves, senhas e certificados
resource "azurerm_key_vault" "main" {
  name                       = local.key_vault_name
  location                   = azurerm_resource_group.main.location
  resource_group_name        = azurerm_resource_group.main.name
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "standard"
  soft_delete_retention_days = 7

  # Policy de acesso para o usuário atual
  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    secret_permissions = [
      "Get", "List", "Set", "Delete", "Purge"
    ]
  }

  tags = local.common_tags
}

# Armazena a chave SSH privada no Key Vault para acesso seguro
resource "azurerm_key_vault_secret" "ssh_private_key" {
  name         = "ssh-private-key"
  value        = tls_private_key.ssh.private_key_pem
  key_vault_id = azurerm_key_vault.main.id

  tags = local.common_tags
}

# Virtual Machines Linux - recurso principal da infraestrutura
# Cria VMs Ubuntu com autenticação via chave SSH
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

  # Configuração da chave SSH para acesso seguro
  admin_ssh_key {
    username   = var.admin_username
    public_key = tls_private_key.ssh.public_key_openssh
  }

  # Configuração do disco do sistema operacional
  os_disk {
    caching              = "ReadWrite"
    storage_account_type = var.os_disk_type
  }

  # Especifica qual imagem usar para criar a VM
  source_image_reference {
    publisher = var.vm_image.publisher
    offer     = var.vm_image.offer
    sku       = var.vm_image.sku
    version   = var.vm_image.version
  }

  # Habilita boot diagnostics para troubleshooting
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

# Managed Disks adicionais para dados - separados do disco do OS
# Boa prática separar dados do sistema operacional
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

# Anexa os discos de dados às VMs correspondentes
resource "azurerm_virtual_machine_data_disk_attachment" "data" {
  count              = var.vm_count
  managed_disk_id    = azurerm_managed_disk.data[count.index].id
  virtual_machine_id = azurerm_linux_virtual_machine.main[count.index].id
  lun                = "10"
  caching            = "ReadWrite"
}
```

## additional-resources.tf

```hcl
# Log Analytics Workspace - recurso condicional para monitoring centralizado
# Só é criado se monitoring estiver habilitado na variável
resource "azurerm_log_analytics_workspace" "main" {
  count               = var.enable_monitoring ? 1 : 0
  name                = local.log_analytics_name
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "PerGB2018"
  retention_in_days   = 30

  tags = local.common_tags
}

# VM Extension para instalar agente de monitoramento nas VMs
# Coleta logs e métricas das VMs enviando para Log Analytics
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

# Recovery Services Vault - cofre para backup das VMs
# Recurso condicional criado apenas se backup estiver habilitado
resource "azurerm_recovery_services_vault" "main" {
  count               = var.enable_backup ? 1 : 0
  name                = "${local.naming_prefix}-rsv"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "Standard"
  soft_delete_enabled = true

  tags = local.common_tags
}

# Política de backup para as VMs - define quando e como fazer backup
resource "azurerm_backup_policy_vm" "main" {
  count               = var.enable_backup ? 1 : 0
  name                = "${local.naming_prefix}-backup-policy"
  resource_group_name = azurerm_resource_group.main.name
  recovery_vault_name = azurerm_recovery_services_vault.main[0].name

  backup {
    frequency = "Daily"
    time      = "23:00"
  }

  # Retenção diária dos backups
  retention_daily {
    count = var.backup_retention_days
  }

  # Retenção semanal - mantém backup de domingo por 4 semanas
  retention_weekly {
    count    = 4
    weekdays = ["Sunday"]
  }

  # Retenção mensal - mantém backup do primeiro domingo por 12 meses
  retention_monthly {
    count    = 12
    weekdays = ["Sunday"]
    weeks    = ["First"]
  }
}

# Proteção de backup aplicada às VMs
# Liga cada VM à política de backup criada
resource "azurerm_backup_protected_vm" "main" {
  count               = var.enable_backup ? var.vm_count : 0
  resource_group_name = azurerm_resource_group.main.name
  recovery_vault_name = azurerm_recovery_services_vault.main[0].name
  source_vm_id        = azurerm_linux_virtual_machine.main[count.index].id
  backup_policy_id    = azurerm_backup_policy_vm.main[0].id
}

# Auto-shutdown das VMs - desliga automaticamente para economizar custos
# Especialmente útil em ambientes de desenvolvimento e teste
resource "azurerm_dev_test_global_vm_shutdown_schedule" "main" {
  count              = local.should_enable_auto_shutdown ? var.vm_count : 0
  virtual_machine_id = azurerm_linux_virtual_machine.main[count.index].id
  location           = azurerm_resource_group.main.location
  enabled            = true

  daily_recurrence_time = var.auto_shutdown_time
  timezone              = var.auto_shutdown_timezone

  # Configurações de notificação antes do shutdown
  notification_settings {
    enabled         = var.notification_email != ""
    time_in_minutes = 30
    email           = var.notification_email != "" ? var.notification_email : "noreply@example.com"
  }

  tags = local.common_tags
}

# Application Security Group - agrupa VMs logicamente para regras de firewall
# Facilita aplicação de regras de segurança baseadas em função
resource "azurerm_application_security_group" "web" {
  name                = "${local.naming_prefix}-asg-web"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  tags = local.common_tags
}

# Associa as NICs das VMs ao Application Security Group
resource "azurerm_network_interface_application_security_group_association" "web" {
  count                         = var.vm_count
  network_interface_id          = azurerm_network_interface.main[count.index].id
  application_security_group_id = azurerm_application_security_group.web.id
}

# Action Group para alertas do Azure Monitor - define quem recebe alertas
resource "azurerm_monitor_action_group" "main" {
  count               = var.enable_monitoring ? 1 : 0
  name                = "${local.naming_prefix}-actiongroup"
  resource_group_name = azurerm_resource_group.main.name
  short_name          = "webapp-ag"

  # Destinatário de email para alertas
  email_receiver {
    name          = "admin"
    email_address = "admin@empresa.com.br"
  }

  tags = local.common_tags
}

# Alerta de CPU alta - monitora uso de CPU das VMs
# Dispara alerta quando CPU passa de 80% por período prolongado
resource "azurerm_monitor_metric_alert" "cpu_high" {
  count               = var.enable_monitoring ? var.vm_count : 0
  name                = "${azurerm_linux_virtual_machine.main[count.index].name}-cpu-alert"
  resource_group_name = azurerm_resource_group.main.name
  scopes              = [azurerm_linux_virtual_machine.main[count.index].id]
  description         = "Alert when CPU usage is over 80%"
  severity            = 2

  # Critério do alerta - CPU média maior que 80%
  criteria {
    metric_namespace = "Microsoft.Compute/virtualMachines"
    metric_name      = "Percentage CPU"
    aggregation      = "Average"
    operator         = "GreaterThan"
    threshold        = 80
  }

  # Ação a tomar quando alerta é disparado
  action {
    action_group_id = azurerm_monitor_action_group.main[0].id
  }

  tags = local.common_tags
}

# Availability Set - garante alta disponibilidade para múltiplas VMs
# Distribui VMs entre diferentes racks e domínios de atualização
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

# Private DNS Zone - resolução de nomes interna para VMs
# Permite usar nomes amigáveis em vez de IPs para comunicação interna
resource "azurerm_private_dns_zone" "main" {
  name                = "${var.project_name}.local"
  resource_group_name = azurerm_resource_group.main.name

  tags = local.common_tags
}

# Link da Private DNS Zone com a VNet - habilita resolução DNS automática
resource "azurerm_private_dns_zone_virtual_network_link" "main" {
  name                  = "${local.naming_prefix}-dns-link"
  resource_group_name   = azurerm_resource_group.main.name
  private_dns_zone_name = azurerm_private_dns_zone.main.name
  virtual_network_id    = azurerm_virtual_network.main.id
  registration_enabled  = true

  tags = local.common_tags
}
```

## variables.tf

```hcl
# Variável para nome do projeto - será usada como prefixo em todos os recursos
# Validação garante apenas letras minúsculas e números para compatibilidade com Azure
variable "project_name" {
  description = "Nome do projeto que será usado como prefixo para recursos"
  type        = string
  default     = "webapp"
  
  validation {
    condition     = can(regex("^[a-z0-9]+$", var.project_name))
    error_message = "Project name deve conter apenas letras minúsculas e números."
  }
}

# Variável de ambiente - controla configurações específicas por ambiente
# Aceita apenas valores predefinidos para evitar erros de configuração
variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
  
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment deve ser: dev, staging, ou prod."
  }
}

# Região Azure onde todos os recursos serão criados
# Lista pré-aprovada de regiões para controlar custos e compliance
variable "location" {
  description = "Azure region onde os recursos serão criados"
  type        = string
  default     = "Brazil South"
  
  validation {
    condition = contains([
      "Brazil South", "East US", "East US 2", "West US", "West US 2",
      "Central US", "North Central US", "South Central US", "West Central US",
      "Canada Central", "Canada East", "West Europe", "North Europe",
      "UK South", "UK West", "France Central", "Germany West Central",
      "Switzerland North", "Norway East", "Sweden Central"
    ], var.location)
    error_message = "Location deve ser uma região Azure válida."
  }
}

# Número de VMs a serem criadas - usado com count em múltiplos recursos
# Limitado entre 1-5 para evitar custos excessivos em labs
variable "vm_count" {
  description = "Número de VMs a serem criadas"
  type        = number
  default     = 1
  
  validation {
    condition     = var.vm_count >= 1 && var.vm_count <= 5
    error_message = "VM count deve estar entre 1 e 5."
  }
}

# Tamanho (SKU) das VMs - define CPU, RAM e performance
# Lista restrita de tamanhos aprovados para controlar custos
variable "vm_size" {
  description = "Tamanho da VM"
  type        = string
  default     = "Standard_B2s"
  
  validation {
    condition = contains([
      "Standard_B1s", "Standard_B1ms", "Standard_B2s", "Standard_B2ms",
      "Standard_B4ms", "Standard_D2s_v3", "Standard_D4s_v3",
      "Standard_F2s_v2", "Standard_F4s_v2"
    ], var.vm_size)
    error_message = "VM size deve ser um dos tamanhos aprovados."
  }
}

# Nome do usuário administrativo das VMs
# Validação garante formato correto (3-20 caracteres, inicia com letra)
variable "admin_username" {
  description = "Nome de usuário administrativo para as VMs"
  type        = string
  default     = "azureuser"
  
  validation {
    condition     = can(regex("^[a-z][a-z0-9]{2,19}$", var.admin_username))
    error_message = "Admin username deve começar com letra minúscula e ter entre 3-20 caracteres."
  }
}

# Tipo de disco para o sistema operacional - afeta performance e custo
# Opções: Standard (HDD), StandardSSD, Premium (SSD)
variable "os_disk_type" {
  description = "Tipo do disco do OS"
  type        = string
  default     = "Premium_LRS"
  
  validation {
    condition = contains([
      "Standard_LRS", "StandardSSD_LRS", "Premium_LRS"
    ], var.os_disk_type)
    error_message = "OS disk type deve ser: Standard_LRS, StandardSSD_LRS, ou Premium_LRS."
  }
}

# Tamanho do disco de dados adicional em GB
# Separado do disco do OS para melhor organização e performance
variable "data_disk_size_gb" {
  description = "Tamanho do disco de dados em GB"
  type        = number
  default     = 64
  
  validation {
    condition     = var.data_disk_size_gb >= 32 && var.data_disk_size_gb <= 1024
    error_message = "Data disk size deve estar entre 32GB e 1024GB."
  }
}

# CIDR da Virtual Network - define range de IPs da rede privada
# Deve ser RFC 1918 (10.x, 172.16-31.x, 192.168.x)
variable "vnet_address_space" {
  description = "Address space para a VNet"
  type        = string
  default     = "10.0.0.0/16"
  
  validation {
    condition     = can(cidrhost(var.vnet_address_space, 0))
    error_message = "VNet address space deve ser um CIDR válido."
  }
}

# CIDR da subnet para servidores web
# Deve estar contido dentro do address_space da VNet
variable "web_subnet_address_prefix" {
  description = "Address prefix para a subnet web"
  type        = string
  default     = "10.0.1.0/24"
  
  validation {
    condition     = can(cidrhost(var.web_subnet_address_prefix, 0))
    error_message = "Web subnet address prefix deve ser um CIDR válido."
  }
}

# CIDR da subnet para banco de dados
# Isolamento de rede para maior segurança dos dados
variable "db_subnet_address_prefix" {
  description = "Address prefix para a subnet de banco de dados"
  type        = string
  default     = "10.0.2.0/24"
  
  validation {
    condition     = can(cidrhost(var.db_subnet_address_prefix, 0))
    error_message = "DB subnet address prefix deve ser um CIDR válido."
  }
}

# Range de IPs permitidos para acesso SSH
# Pode ser CIDR específico ou "*" para qualquer IP (não recomendado para prod)
variable "ssh_source_address_prefix" {
  description = "Source address prefix permitido para SSH"
  type        = string
  default     = "*"
  
  validation {
    condition = can(cidrhost(var.ssh_source_address_prefix, 0)) || var.ssh_source_address_prefix == "*"
    error_message = "SSH source address prefix deve ser um CIDR válido ou '*'."
  }
}

# Objeto complexo que define qual imagem de VM usar
# Especifica publisher, offer, sku e version da imagem do Azure Marketplace
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

# Tags personalizadas para recursos - importante para billing e governança
# Validação garante formato correto das chaves das tags
variable "tags" {
  description = "Tags adicionais para aplicar aos recursos"
  type        = map(string)
  default     = {}
  
  validation {
    condition     = alltrue([for k, v in var.tags : can(regex("^[a-zA-Z0-9_.-]+$", k))])
    error_message = "Tag keys devem conter apenas letras, números, hífens, underscores e pontos."
  }
}

# Flag para habilitar backup das VMs - recursos condicionais
# Controla criação do Recovery Services Vault e políticas de backup
variable "enable_backup" {
  description = "Habilitar backup das VMs"
  type        = bool
  default     = false
}

# Período de retenção dos backups em dias
# Afeta custos de armazenamento - maior retenção = maior custo
variable "backup_retention_days" {
  description = "Número de dias para retenção de backup"
  type        = number
  default     = 30
  
  validation {
    condition     = var.backup_retention_days >= 7 && var.backup_retention_days <= 365
    error_message = "Backup retention deve estar entre 7 e 365 dias."
  }
}

# Flag para habilitar monitoring com Log Analytics
# Controla criação do workspace e instalação de agentes
variable "enable_monitoring" {
  description = "Habilitar monitoring com Log Analytics"
  type        = bool
  default     = true
}

# Horário para auto-shutdown das VMs em formato 24h (HHMM)
# Crucial para economizar custos em ambientes de desenvolvimento
variable "auto_shutdown_time" {
  description = "Horário para auto shutdown das VMs (formato 24h: HHMM)"
  type        = string
  default     = "1800"
  
  validation {
    condition     = can(regex("^([01]?[0-9]|2[0-3])[0-5][0-9]$", var.auto_shutdown_time))
    error_message = "Auto shutdown time deve estar no formato HHMM (ex: 1800 para 18:00)."
  }
}

# Timezone para o auto-shutdown - importante para horário correto
variable "auto_shutdown_timezone" {
  description = "Timezone para auto shutdown"
  type        = string
  default     = "E. South America Standard Time"
}

# Email para receber notificações de auto-shutdown (opcional)
# Se vazio, notificações são desabilitadas
variable "notification_email" {
  description = "Email para receber notificações de auto-shutdown (opcional)"
  type        = string
  default     = ""
  
  validation {
    condition = var.notification_email == "" || can(regex("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$", var.notification_email))
    error_message = "Notification email deve ser um email válido ou string vazia."
  }
}

# Lista de CIDRs permitidos para SSH - alternativa mais granular ao ssh_source_address_prefix
# Permite múltiplos ranges (ex: rede corporativa + VPN)
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

## locals.tf

```hcl
locals {
  # Prefixo padrão para nomenclatura de recursos
  # Combina nome do projeto + ambiente (ex: webapp-dev)
  naming_prefix = "${var.project_name}-${var.environment}"
  
  # Nomes padronizados de recursos seguindo convenção {projeto}-{ambiente}-{tipo}
  # Centralizado para facilitar mudanças e manter consistência
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
  
  # Nome da storage account sem hífens (limitação do Azure)
  # Combina projeto + ambiente + sufixo aleatório para uniqueness global
  storage_account_prefix = replace("${var.project_name}${var.environment}diag", "-", "")
  
  # Prefixo DNS para Public IPs - deve ser globalmente único
  # Inclui sufixo aleatório para evitar conflitos
  dns_prefix = "${var.project_name}${var.environment}${random_id.storage_suffix.hex}"
  
  # Tags comuns aplicadas a todos os recursos
  # Merge combina tags padrão com tags personalizadas do usuário
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
  
  # Configuração de rede centralizada
  # Facilita referência e possíveis mudanças futuras
  network_config = {
    vnet_address_space         = var.vnet_address_space
    web_subnet_address_prefix  = var.web_subnet_address_prefix
    db_subnet_address_prefix   = var.db_subnet_address_prefix
    dns_servers               = ["168.63.129.16"] # Azure DNS padrão
  }
  
  # Configurações específicas por ambiente para otimização de custos
  # Define tamanhos e features apropriados para cada ambiente
  vm_config = {
    dev = {
      size                = "Standard_B1s"      # VM pequena para dev
      os_disk_type       = "Standard_LRS"      # Disco mais barato
      data_disk_size_gb  = 32                  # Disco menor
      enable_backup      = false               # Sem backup para economizar
      auto_shutdown      = true                # Auto-shutdown habilitado
    }
    staging = {
      size                = "Standard_B2s"      # VM média para staging
      os_disk_type       = "StandardSSD_LRS"   # SSD padrão
      data_disk_size_gb  = 64                  # Disco médio
      enable_backup      = true                # Backup habilitado
      auto_shutdown      = true                # Auto-shutdown habilitado
    }
    prod = {
      size                = "Standard_D2s_v3"   # VM robusta para prod
      os_disk_type       = "Premium_LRS"       # SSD premium
      data_disk_size_gb  = 128                 # Disco maior
      enable_backup      = true                # Backup obrigatório
      auto_shutdown      = false               # Sem auto-shutdown
    }
  }
  
  # Valores efetivos baseados no ambiente atual
  # Se variável não foi alterada, usa configuração do ambiente
  effective_vm_size = var.vm_size != "Standard_B2s" ? var.vm_size : local.vm_config[var.environment].size
  effective_os_disk_type = var.os_disk_type != "Premium_LRS" ? var.os_disk_type : local.vm_config[var.environment].os_disk_type
  effective_data_disk_size = var.data_disk_size_gb != 64 ? var.data_disk_size_gb : local.vm_config[var.environment].data_disk_size_gb
  
  # Regras de segurança para tráfego web (HTTP/HTTPS)
  # Array de objetos que define regras padrão para servidores web
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
  
  # Regras de SSH dinâmicas - uma para cada CIDR permitido
  # For expression cria regras com prioridades incrementais
  ssh_security_rules = [
    for i, cidr in var.allowed_ssh_cidrs : {
      name                       = "SSH-${i + 1}"
      priority                   = 1100 + i        # Prioridades: 1100, 1101, 1102...
      direction                  = "Inbound"
      access                     = "Allow"
      protocol                   = "Tcp"
      source_port_range          = "*"
      destination_port_range     = "22"
      source_address_prefix      = cidr
      destination_address_prefix = "*"
    }
  ]
  
  # Todas as regras de segurança combinadas
  # Concat junta arrays de regras web + SSH
  all_security_rules = concat(local.web_security_rules, local.ssh_security_rules)
  
  # Configuração de backup condicional
  # Só define configuração se backup estiver habilitado
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
  
  # Configuração de monitoring condicional
  # Define parâmetros do Log Analytics se monitoring habilitado
  monitoring_config = var.enable_monitoring ? {
    workspace_name       = local.log_analytics_name
    retention_days      = 30
    sku                 = "PerGB2018"
    solutions = [
      "VMInsights",    # Insights de VMs
      "Security",      # Security Center
      "Updates"        # Update Management
    ]
  } : null
  
  # Configuração de auto-shutdown
  # Combina configuração do ambiente com variáveis do usuário
  auto_shutdown_config = {
    enabled          = local.vm_config[var.environment].auto_shutdown
    time            = var.auto_shutdown_time
    timezone        = var.auto_shutdown_timezone
    notification_settings = {
      enabled         = true
      time_in_minutes = 30                # Notifica 30min antes
      webhook_url     = ""
      email_recipient = ""
    }
  }
  
  # Flags condicionais para criação de recursos
  # Determinam quais recursos opcionais criar baseado em lógica
  should_create_load_balancer = var.vm_count > 1                                      # LB só com múltiplas VMs
  should_create_backup = var.enable_backup && local.vm_config[var.environment].enable_backup  # Backup habilitado + config do ambiente
  should_create_monitoring = var.enable_monitoring                                     # Monitoring se habilitado
  should_enable_auto_shutdown = local.auto_shutdown_config.enabled                    # Auto-shutdown baseado no ambiente
  
  # Mapeamento de regiões Azure para códigos curtos
  # Usado para nomenclatura quando região faz parte do nome
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
  
  # Sufixo da localização para nomenclatura
  location_suffix = lookup(local.location_short, var.location, "unknown")
  
  # Nomenclatura avançada incluindo localização
  # Para recursos que precisam indicar região no nome
  advanced_naming = {
    resource_group    = "${local.naming_prefix}-${local.location_suffix}-rg"
    storage_account   = lower(replace("${var.project_name}${var.environment}${local.location_suffix}sa${random_id.storage_suffix.hex}", "-", ""))
    key_vault        = "${local.naming_prefix}-${local.location_suffix}-kv"
  }
  
  # Configuração de Network ACLs para storage accounts
  # Produção nega acesso por padrão, outros ambientes permitem tudo
  network_acls = {
    default_action = "Deny"
    ip_rules = var.environment == "prod" ? [] : ["0.0.0.0/0"]  # Prod sem IPs permitidos
    virtual_network_subnet_ids = [
      # Será preenchido após criação das subnets se necessário
    ]
  }
}
```

## outputs.tf

```hcl
# Informações básicas do Resource Group
# Nome do container lógico que agrupa todos os recursos
output "resource_group_name" {
  description = "Nome do Resource Group criado"
  value       = azurerm_resource_group.main.name
}

# Localização onde os recursos foram criados
output "resource_group_location" {
  description = "Localização do Resource Group"
  value       = azurerm_resource_group.main.location
}

# ID único do Resource Group no Azure
output "resource_group_id" {
  description = "ID do Resource Group"
  value       = azurerm_resource_group.main.id
}

# Informações da rede virtual criada
# Nome da VNet para referência em outros scripts
output "virtual_network_name" {
  description = "Nome da Virtual Network"
  value       = azurerm_virtual_network.main.name
}

# ID da VNet para uso em associações e políticas
output "virtual_network_id" {
  description = "ID da Virtual Network"
  value       = azurerm_virtual_network.main.id
}

# Espaço de endereços da VNet para documentação e troubleshooting
output "virtual_network_address_space" {
  description = "Address space da Virtual Network"
  value       = azurerm_virtual_network.main.address_space
}

# IDs das subnets para conexão de recursos futuros
output "web_subnet_id" {
  description = "ID da subnet web"
  value       = azurerm_subnet.web.id
}

output "database_subnet_id" {
  description = "ID da subnet database"
  value       = azurerm_subnet.database.id
}

# Informações das VMs criadas
# Lista com nomes de todas as VMs para administração
output "vm_names" {
  description = "Nomes das VMs criadas"
  value       = azurerm_linux_virtual_machine.main[*].name
}

# IDs das VMs para uso em scripts de automação
output "vm_ids" {
  description = "IDs das VMs criadas"
  value       = azurerm_linux_virtual_machine.main[*].id
}

# IPs privados das VMs para comunicação interna
# For expression extrai IP de cada network interface
output "vm_private_ip_addresses" {
  description = "Endereços IP privados das VMs"
  value = [
    for nic in azurerm_network_interface.main :
    nic.ip_configuration[0].private_ip_address
  ]
}

# IPs públicos das VMs para acesso externo
# Lista de IPs para conexão SSH e acesso web
output "vm_public_ip_addresses" {
  description = "Endereços IP públicos das VMs"
  value = [
    for pip in azurerm_public_ip.main :
    pip.ip_address
  ]
}

# FQDNs (nomes DNS completos) das VMs
# URLs amigáveis para acesso às VMs
output "vm_fqdns" {
  description = "FQDNs das VMs"
  value = [
    for pip in azurerm_public_ip.main :
    pip.fqdn
  ]
}

# Informações do Load Balancer (quando aplicável)
# IP público do LB se múltiplas VMs foram criadas
output "load_balancer_public_ip" {
  description = "IP público do Load Balancer"
  value       = var.vm_count > 1 ? azurerm_public_ip.lb[0].ip_address : null
}

# FQDN do Load Balancer para acesso web balanceado
output "load_balancer_fqdn" {
  description = "FQDN do Load Balancer"
  value       = var.vm_count > 1 ? azurerm_public_ip.lb[0].fqdn : null
}

# Chave SSH privada para acesso às VMs
# Marcada como sensitive para não aparecer em logs
output "ssh_private_key_pem" {
  description = "Chave SSH privada em formato PEM"
  value       = tls_private_key.ssh.private_key_pem
  sensitive   = true
}

# Chave SSH pública para referência e backup
output "ssh_public_key" {
  description = "Chave SSH pública"
  value       = tls_private_key.ssh.public_key_openssh
}

# Informações da Storage Account para boot diagnostics
output "boot_diagnostics_storage_account_name" {
  description = "Nome da Storage Account para boot diagnostics"
  value       = azurerm_storage_account.boot_diagnostics.name
}

# Endpoint da storage account para configurações adicionais
output "boot_diagnostics_storage_account_primary_endpoint" {
  description = "Endpoint primário da Storage Account"
  value       = azurerm_storage_account.boot_diagnostics.primary_blob_endpoint
}

# Informações do Key Vault para acesso a secrets
output "key_vault_name" {
  description = "Nome do Key Vault"
  value       = azurerm_key_vault.main.name
}

# URI do Key Vault para integração com aplicações
output "key_vault_uri" {
  description = "URI do Key Vault"
  value       = azurerm_key_vault.main.vault_uri
}

# Informações dos discos de dados adicionais
output "data_disk_names" {
  description = "Nomes dos discos de dados"
  value       = azurerm_managed_disk.data[*].name
}

# Tamanhos dos discos para planejamento de capacidade
output "data_disk_sizes" {
  description = "Tamanhos dos discos de dados em GB"
  value       = azurerm_managed_disk.data[*].disk_size_gb
}

# Informações do Network Security Group
output "web_nsg_id" {
  description = "ID do Network Security Group web"
  value       = azurerm_network_security_group.web.id
}

# Regras de segurança aplicadas para auditoria
# For expression formata regras de forma legível
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

# Resumo completo do deployment para documentação
# Objeto com todas as informações principais
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

# Informações para estimativa de custos
# Dados estruturados para cálculos de billing
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

# Informações de conexão SSH prontas para uso
# Comandos formatados para conexão imediata
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

# Informações de DNS para acesso amigável
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

## terraform.tfvars

```hcl
# terraform.tfvars - Configuração principal do projeto
# Este arquivo contém os valores padrão para todas as variáveis

# === CONFIGURAÇÃO BÁSICA DO PROJETO ===
# Nome do projeto usado como prefixo em todos os recursos
project_name = "webapp"

# Ambiente de deployment - controla configurações específicas
environment  = "dev"

# Região Azure onde criar todos os recursos - impacta latência e custos
location     = "Brazil South"

# === CONFIGURAÇÃO DAS VIRTUAL MACHINES ===
# Número de VMs a criar - usando 2 para demonstrar load balancer
vm_count          = 2

# Tamanho da VM - Standard_B2s é boa opção custo-benefício para testes
vm_size           = "Standard_B2s"

# Nome do usuário administrativo das VMs
admin_username    = "azureuser"

# Tipo do disco do sistema operacional - Premium para melhor performance
os_disk_type      = "Premium_LRS"

# Tamanho do disco de dados adicional em GB
data_disk_size_gb = 64

# === CONFIGURAÇÃO DE REDE ===
# CIDR da Virtual Network - range privado para toda a infraestrutura
vnet_address_space        = "10.0.0.0/16"

# Subnet para servidores web - onde ficam as VMs
web_subnet_address_prefix = "10.0.1.0/24"

# Subnet para banco de dados - isolamento de rede
db_subnet_address_prefix  = "10.0.2.0/24"

# Range de IPs permitidos para SSH - "*" permite qualquer IP (cuidado em prod!)
ssh_source_address_prefix = "*"

# Lista de CIDRs permitidos para SSH - alternativa mais granular
allowed_ssh_cidrs = [
  "0.0.0.0/0" # Substitua pelo seu IP ou range corporativo para maior segurança
  # Exemplos de uso em produção:
  # "201.123.45.0/24",  # Range corporativo
  # "10.0.0.0/8"        # Rede interna VPN
]

# === CONFIGURAÇÃO DA IMAGEM DA VM ===
# Imagem Ubuntu 20.04 LTS - estável e amplamente suportada
vm_image = {
  publisher = "Canonical"
  offer     = "0001-com-ubuntu-server-focal"
  sku       = "20_04-lts-gen2"
  version   = "latest"
}

# === CONFIGURAÇÕES OPCIONAIS ===
# Habilitar backup das VMs - importante para dados críticos
enable_backup         = true

# Período de retenção dos backups em dias
backup_retention_days = 30

# Habilitar monitoring com Log Analytics - recomendado para observabilidade
enable_monitoring     = true

# === CONFIGURAÇÃO DE AUTO-SHUTDOWN ===
# Horário para desligar VMs automaticamente (formato 24h)
auto_shutdown_time     = "1900" # 19:00 - economiza custos em ambiente de desenvolvimento

# Timezone para o auto-shutdown
auto_shutdown_timezone = "E. South America Standard Time"

# Email para receber notificações de shutdown (opcional)
# Deixe vazio ("") se não quiser receber notificações
notification_email = "" # Exemplo: "admin@empresa.com"

# === TAGS PERSONALIZADAS ===
# Tags aplicadas a todos os recursos para organização e billing
tags = {
  Owner      = "DevOps Team"           # Responsável pelos recursos
  CostCenter = "TI-Infraestrutura"    # Centro de custo para billing
  Project    = "Projeto Final Terraform"  # Nome do projeto
  Course     = "Udemy Terraform"      # Referência ao curso
  Student    = "Seu Nome Aqui"        # Personalize com seu nome
  Purpose    = "Learning"             # Propósito dos recursos
  Department = "Engineering"          # Departamento responsável
}
```

## dev.tfvars

```hcl
# dev.tfvars - Configuração específica para ambiente de desenvolvimento
# Otimizada para custos baixos e flexibilidade

# === IDENTIFICAÇÃO DO AMBIENTE ===
project_name = "webapp"
environment  = "dev"      # Ambiente de desenvolvimento
location     = "Brazil South"

# === CONFIGURAÇÃO ECONÔMICA PARA DEV ===
# Uma VM pequena é suficiente para desenvolvimento
vm_count          = 1
vm_size           = "Standard_B1s"    # VM mais barata disponível
admin_username    = "azureuser"

# Discos mais baratos para desenvolvimento
os_disk_type      = "Standard_LRS"    # HDD padrão (mais barato)
data_disk_size_gb = 32               # Disco menor para economizar

# === REDE SIMPLIFICADA ===
# Range de rede separado para desenvolvimento
vnet_address_space        = "10.10.0.0/16"
web_subnet_address_prefix = "10.10.1.0/24"
db_subnet_address_prefix  = "10.10.2.0/24"

# === SEGURANÇA RELAXADA PARA DEV ===
# Em desenvolvimento, permitimos acesso de qualquer IP para facilitar testes
ssh_source_address_prefix = "*"
allowed_ssh_cidrs         = ["0.0.0.0/0"]

# === IMAGEM PADRÃO ===
# Ubuntu LTS para consistência entre ambientes
vm_image = {
  publisher = "Canonical"
  offer     = "0001-com-ubuntu-server-focal"
  sku       = "20_04-lts-gen2"
  version   = "latest"
}

# === FEATURES DESABILITADAS PARA ECONOMIA ===
# Em desenvolvimento, desabilitamos features caras
enable_backup     = false    # Não fazemos backup em dev para economizar
enable_monitoring = false    # Monitoring desabilitado para reduzir custos

# === AUTO-SHUTDOWN AGRESSIVO ===
# Desliga VMs cedo para máxima economia
auto_shutdown_time     = "1800" # 18:00 - mais cedo que outros ambientes
auto_shutdown_timezone = "E. South America Standard Time"

# Notificações desabilitadas em dev
notification_email = ""

# === TAGS DE DESENVOLVIMENTO ===
# Tags específicas para ambiente de desenvolvimento
tags = {
  Owner       = "Developer"        # Desenvolvedor responsável
  CostCenter  = "R&D"             # Centro de pesquisa e desenvolvimento
  Environment = "Development"      # Identificação clara do ambiente
  AutoDelete  = "true"            # Indica que pode ser deletado automaticamente
  Purpose     = "Learning"        # Propósito educacional
  Course      = "Terraform Udemy" # Referência ao curso
}
```

## prod.tfvars

```hcl
# prod.tfvars - Configuração específica para ambiente de produção
# Otimizada para performance, disponibilidade e segurança

# === IDENTIFICAÇÃO DO AMBIENTE ===
project_name = "webapp"
environment  = "prod"     # Ambiente de produção
location     = "Brazil South"

# === CONFIGURAÇÃO ROBUSTA PARA PRODUÇÃO ===
# Múltiplas VMs para alta disponibilidade
vm_count          = 3
vm_size           = "Standard_D2s_v3"    # VM com boa performance (2 vCPUs, 8GB RAM)
admin_username    = "prodadmin"          # Nome específico para produção

# Discos premium para máxima performance
os_disk_type      = "Premium_LRS"        # SSD premium
data_disk_size_gb = 128                  # Disco maior para dados de produção

# === REDE SEGMENTADA ===
# Range de rede padrão para produção
vnet_address_space        = "10.0.0.0/16"
web_subnet_address_prefix = "10.0.1.0/24"
db_subnet_address_prefix  = "10.0.2.0/24"

# === SEGURANÇA RESTRITA ===
# IMPORTANTE: Substitua pelos IPs reais da sua organização
ssh_source_address_prefix = "203.0.113.0/24" # Exemplo de range corporativo

# Lista de ranges permitidos para SSH em produção
allowed_ssh_cidrs = [
  "203.0.113.0/24",    # Range corporativo principal
  "198.51.100.0/24"    # Range da VPN corporativa
  # Adicione outros ranges conforme necessário
  # Nunca use "0.0.0.0/0" em produção!
]

# === IMAGEM PADRÃO ===
# Ubuntu LTS para estabilidade em produção
vm_image = {
  publisher = "Canonical"
  offer     = "0001-com-ubuntu-server-focal"
  sku       = "20_04-lts-gen2"
  version   = "latest"
}

# === FEATURES COMPLETAS PARA PRODUÇÃO ===
# Todos os recursos de proteção habilitados
enable_backup         = true      # Backup obrigatório em produção
backup_retention_days = 90        # Retenção longa para compliance
enable_monitoring     = true      # Monitoring 24x7 obrigatório

# === AUTO-SHUTDOWN DESABILITADO ===
# Produção não pode ser desligada automaticamente
auto_shutdown_time     = "0000"   # Desabilitado (00:00 = sem shutdown)
auto_shutdown_timezone = "E. South America Standard Time"

# === TAGS DE PRODUÇÃO ===
# Tags específicas para ambiente de produção com informações críticas
tags = {
  Owner        = "Operations Team"   # Time de operações responsável
  CostCenter   = "Production"        # Centro de custo de produção
  Environment  = "Production"        # Identificação crítica do ambiente
  Criticality  = "High"             # Criticidade alta
  BackupPolicy = "Daily"            # Política de backup diário
  Monitoring   = "24x7"             # Monitoramento contínuo
  Compliance   = "Required"         # Compliance obrigatório
  DataClass    = "Confidential"     # Classificação dos dados
}
```

## Comandos de Execução

```bash
# === CONFIGURAÇÃO INICIAL DO AZURE ===
# Login no Azure e configuração da subscription
az login
az account list --output table
az account set --subscription "sua-subscription-id"
az account show

# Exportar variável de ambiente para subscription (opcional)
export ARM_SUBSCRIPTION_ID="sua-subscription-id"

# === INICIALIZAÇÃO DO TERRAFORM ===
# Inicializa o projeto, baixa providers e configura backend
terraform init

# Valida sintaxe e configuração dos arquivos
terraform validate

# Formata código para manter padrão consistente
terraform fmt

# === DEPLOYMENT POR AMBIENTE ===
# Desenvolvimento - recursos mínimos
terraform plan -var-file="dev.tfvars"
terraform apply -var-file="dev.tfvars" -auto-approve

# Produção - recursos completos (cuidado!)
terraform plan -var-file="prod.tfvars"
terraform apply -var-file="prod.tfvars"

# === VERIFICAÇÃO DOS RECURSOS ===
# Mostra todos os outputs definidos
terraform output

# Lista recursos criados no Azure
az resource list --resource-group $(terraform output -raw resource_group_name) --output table

# Lista específica de VMs criadas
az vm list --resource-group $(terraform output -raw resource_group_name) --output table

# === TESTE DE CONECTIVIDADE SSH ===
# Obtém IP público da primeira VM
VM_IP=$(az network public-ip show \
  --resource-group $(terraform output -raw resource_group_name) \
  --name webapp-dev-pip-1 \
  --query ipAddress -o tsv)

# Salva chave SSH privada para conexão
terraform output -raw ssh_private_key_pem > private_key.pem
chmod 600 private_key.pem

# Conecta à VM via SSH
ssh -i private_key.pem azureuser@$VM_IP

# === TESTES DENTRO DA VM ===
# Verifica informações do sistema
uname -a
df -h        # Espaço em disco
lsblk        # Lista discos anexados

# Instala e testa nginx
sudo apt update
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
curl localhost   # Testa servidor web

# === MONITORAMENTO DE CUSTOS ===
# Verifica uso atual da subscription
az consumption usage list --output table

# Monitora custos no portal (abrir em navegador)
echo "Monitorar custos em: https://portal.azure.com/#blade/Microsoft_Azure_CostManagement/Menu/overview"

# === LIMPEZA DOS RECURSOS ===
# CUIDADO: Remove toda a infraestrutura criada
terraform destroy -var-file="dev.tfvars" -auto-approve

# Verifica se resource groups foram removidos
az group list --output table
```

## Resumo das Funcionalidades Demonstradas

Este laboratório final demonstra uso **avançado** do Terraform com:

### ✅ **Variables e Validação**
- Variables tipadas (string, number, bool, object, list)
- Validação com regex, contains(), range checks
- Objetos complexos para configuração de imagens
- Validação de CIDRs e emails

### ✅ **Locals e Lógica Complexa**
- Naming conventions centralizadas
- Configuração condicional por ambiente
- Maps de objetos para configurações
- For expressions para listas dinâmicas
- Merge de tags padrão com personalizadas

### ✅ **Outputs Informativos**
- Informações de recursos criados
- Comandos SSH prontos para uso
- Dados para estimativa de custos
- Resumo completo do deployment

### ✅ **Count e For Expressions**
- Múltiplas VMs com count
- Public IPs dinâmicos
- Regras de segurança geradas dinamicamente
- Resources attachments em loop

### ✅ **Providers Múltiplos**
- **azurerm**: Recursos do Azure
- **random**: IDs únicos para storage
- **tls**: Geração automática de chaves SSH
- **time**: Timestamps e delays
- **null**: Triggers e dependências

### ✅ **Recursos Condicionais**
- Load Balancer só com múltiplas VMs
- Backup baseado em flags
- Monitoring condicional
- Auto-shutdown por ambiente

### ✅ **Data Sources**
- Azure client config automático
- Informações da sessão atual
- Tenant e subscription IDs

### ✅ **Funcionalidades de Produção**
- Key Vault para secrets
- Network Security Groups
- Managed Disks separados
- Boot diagnostics
- Auto-shutdown para economia
- Tags organizacionais completas
- Backup policies
- Log Analytics e monitoring
- Application Security Groups
- Private DNS zones

### 💰 **Estimativa de Custos**
- **Desenvolvimento**: ~$8-15 USD/mês (com auto-shutdown)
- **Produção**: ~$390-515 USD/mês (3 VMs, backup completo, monitoring)

Este é um **projeto de portfólio** que demonstra domínio profissional do Terraform para Infrastructure as Code em ambiente empresarial.
```