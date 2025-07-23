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