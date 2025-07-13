---
id: lab-10-trivy
title: Lab 10 - Criando uma VM com vulnerabilidades para análise com Trivy
noindex: true
---

# Lab: Criando uma VM com vulnerabilidades para análise com Trivy

## Introdução
Neste laboratório, vamos criar uma máquina virtual no Azure usando Terraform 1.12.2. O objetivo é intencionalmente inserir más práticas de configuração (vulnerabilidades) para que possam ser detectadas com o **Trivy** e, posteriormente, corrigidas de forma simples.

## Pré-requisitos
- Terraform 1.12.2 instalado
- Conta Azure autenticada com `az login`
- Trivy instalado (https://aquasecurity.github.io/trivy)

## Etapas Iniciais
1. Crie a estrutura do projeto:
```bash
mkdir lab-vm-trivy && cd lab-vm-trivy

touch main.tf variables.tf outputs.tf provider.tf terraform.tfvars
```

2. Estrutura esperada:
```
lab-vm-trivy/
├── main.tf
├── outputs.tf
├── provider.tf
├── variables.tf
└── terraform.tfvars
```

## Arquivo: provider.tf
```terraform
provider "azurerm" {
  features {}
}
```

## Arquivo: variables.tf
```terraform
variable "location" {
  default = "eastus"
}

variable "admin_username" {
  default = "adminuser"
}

variable "admin_password" {
  default = "P@ssw0rd123"  # má prática: senha no código
}
```

## Arquivo: main.tf
```terraform
locals {
  prefix = "vm-trivy"
}

resource "azurerm_resource_group" "rg" {
  name     = "${local.prefix}-rg"
  location = var.location
}

resource "azurerm_virtual_network" "vnet" {
  name                = "${local.prefix}-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name
}

resource "azurerm_subnet" "subnet" {
  name                 = "default"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_network_security_group" "nsg" {
  name                = "${local.prefix}-nsg"
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name

  security_rule {
    name                       = "Allow_All_Inbound"  # má prática
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}

resource "azurerm_network_interface" "nic" {
  name                = "${local.prefix}-nic"
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.subnet.id
    private_ip_address_allocation = "Dynamic"
  }
}

resource "azurerm_network_interface_security_group_association" "nsg_assoc" {
  network_interface_id      = azurerm_network_interface.nic.id
  network_security_group_id = azurerm_network_security_group.nsg.id
}

resource "azurerm_linux_virtual_machine" "vm" {
  name                = "${local.prefix}-vm"
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name
  size                = "Standard_B1s"
  admin_username      = var.admin_username
  admin_password      = var.admin_password
  disable_password_authentication = false  # má prática

  network_interface_ids = [azurerm_network_interface.nic.id]

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
    name                 = "osdisk"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "18.04-LTS"
    version   = "latest"
  }
}
```

## Arquivo: outputs.tf
```terraform
output "vm_name" {
  value = azurerm_linux_virtual_machine.vm.name
}

output "nsg_name" {
  value = azurerm_network_security_group.nsg.name
}
```

## Arquivo: terraform.tfvars
```hcl
admin_username = "adminuser"
admin_password = "P@ssw0rd123"
location       = "eastus"
```

## Comandos Terraform
```bash
terraform init
```

## Verificação com Trivy
```bash
trivy config  .
```

## Alterar o main.tf para a configuração abaixo:


```terraform
locals {
  prefix = "vm-trivy"
  subnet_cidr = "10.0.1.0/24"
}

resource "azurerm_resource_group" "rg" {
  name     = "${local.prefix}-rg"
  location = "East US"
}

resource "azurerm_virtual_network" "vnet" {
  name = "${local.prefix}-vnet"
  address_space = ["10.0.0.0/16"]
  location = var.location
    resource_group_name = azurerm_resource_group.rg.name
  
}

resource "azurerm_subnet" "subnet" {
    name= "${local.prefix}-subnet"
  resource_group_name = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_resource_group.rg.name
  address_prefixes = ["10.0.1.0/24"]
  
}

resource "azurerm_network_security_group" "nsg" {
  name                = "${local.prefix}-nsg"
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name

  security_rule {
    name                       = "Allow_SSH_ADMIN"  # má prática
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = "203.0.113.10"
    destination_address_prefix = "VirtualNetwork"
  }
}

resource "azurerm_network_interface" "nic" {
  name                = "${local.prefix}-nic"
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.subnet.id
    private_ip_address_allocation = "Dynamic"
  }
}

resource "azurerm_network_interface_security_group_association" "nsg_assoc" {
  network_interface_id      = azurerm_network_interface.nic.id
  network_security_group_id = azurerm_network_security_group.nsg.id
}

resource "azurerm_linux_virtual_machine" "vm" {
  name                = "${local.prefix}-vm"
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name
  size                = "Standard_B1s"
  admin_username      = var.admin_username
  admin_password      = var.admin_password
  disable_password_authentication = true  # má prática

  network_interface_ids = [azurerm_network_interface.nic.id]

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
    name                 = "osdisk"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "18.04-LTS"
    version   = "latest"
  }

  admin_ssh_key {
    username = var.admin_username
    public_key = file("~/.ssh/id_rsa.pub")
  }

}
```

## Verificação com Trivy
```bash
trivy config  .
```

## Vulnerabilidades Esperadas
- Regra NSG permitindo **todo o tráfego inbound** (`*:*`)
- Autenticação por **senha fraca embutida no código**

## Correções Possíveis
- Restringir regras NSG para portas e IPs específicos
- Usar `admin_ssh_key` e desabilitar autenticação por senha

## Dicas e Boas Práticas
- Evite regras NSG amplas — limite por porta/IP
- Não use senhas no código — prefira chaves SSH
- Use Trivy para detectar problemas antes do apply

---

