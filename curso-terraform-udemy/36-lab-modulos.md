---
id: lab-18-modulos
title: Lab 18 - Criando uma Máquina Virtual no Azure com Módulo Terraform
noindex: trues
---
# Lab: Criando uma Máquina Virtual no Azure com Módulo Terraform

## Introdução

Este laboratório demonstra como criar uma **máquina virtual Linux no Azure** usando um **módulo Terraform** bem estruturado. Modularizar o código facilita a reutilização, manutenção e padronização em projetos profissionais.

## Pré-requisitos

* Terraform instalado (versão >= 1.12.2)
* Azure CLI instalada e autenticada (`az login`)
* Um resource group existente no Azure

### Criar o Resource Group com Azure CLI

Se ainda não existir, crie o resource group com o comando:

```bash
az group create --name rg-devopsautomation --location eastus
```

---

## Estrutura de Diretórios

Para iniciar o projeto, execute:

```bash
mkdir -p lab-vm-com-modulo/modules/vm-linux && cd lab-vm-com-modulo

touch main.tf variables.tf terraform.tfvars
cd modules/vm-linux

touch main.tf variables.tf outputs.tf providers.tf
cd ../../
```

### Estrutura esperada

```
lab-vm-com-modulo/
├── main.tf
├── variables.tf
├── terraform.tfvars
├── modules/
│   └── vm-linux/
│       ├── main.tf
│       ├── variables.tf
│       ├── outputs.tf
│       └── providers.tf
```

---

## Arquivo `main.tf`

```terraform
module "vm_linux" {
  source                  = "./modules/vm-linux"
  resource_group_name     = var.resource_group_name
  admin_username          = var.admin_username
  admin_password          = var.admin_password
  location                = var.location
  vm_name                 = var.vm_name
  vm_size                 = var.vm_size
  vnet_name               = var.vnet_name
  vnet_address_space      = var.vnet_address_space
  subnet_name             = var.subnet_name
  subnet_prefix           = var.subnet_prefix
  public_ip_name          = var.public_ip_name
  nic_name                = var.nic_name
  os_disk_name            = var.os_disk_name
  os_disk_storage_account = var.os_disk_storage_account
  image_offer             = var.image_offer
  image_publisher         = var.image_publisher
  image_sku               = var.image_sku
  image_version           = var.image_version
  nsg_name                = var.nsg_name
}
```

---

## Arquivo: `outputs.tf`

```terraform
output "vm_ssh_command" {
    description = "value of the SSH command to connect to the VM"
    value = "ssh ${var.admin_username}@${module.vm_linux.public_ip}"
}
```

---

## Arquivo `variables.tf`

```terraform
variable "resource_group_name" {
  type = string
}

variable "admin_username" {
  type = string
}

variable "admin_password" {
  type      = string
  sensitive = true
}

variable "location" {
  type = string
}

variable "vm_name" {
  type = string
}

variable "vm_size" {
  type = string
}

variable "vnet_name" {
  type = string
}

variable "vnet_address_space" {
  type = list(string)
}

variable "subnet_name" {
  type = string
}

variable "subnet_prefix" {
  type = list(string)
}

variable "public_ip_name" {
  type = string
}

variable "nic_name" {
  type = string
}

variable "os_disk_name" {
  type = string
}

variable "os_disk_storage_account" {
  type = string
}

variable "image_publisher" {
  type = string
}

variable "image_offer" {
  type = string
}

variable "image_sku" {
  type = string
}

variable "image_version" {
  type = string
}

variable "nsg_name" {
  type = string
}
```

---

## Arquivo `terraform.tfvars`

```terraform
resource_group_name     = "rg-devopsautomation"
admin_username          = "azureuser"
admin_password          = "P@ssw0rd1234!"
location                = "East US"
vm_name                 = "devopsautomation-vm"
vm_size                 = "Standard_DS1_v2"
vnet_name               = "devopsautomation-vnet"
vnet_address_space      = ["10.0.0.0/16"]
subnet_name             = "devopsautomation-subnet"
subnet_prefix           = ["10.0.1.0/24"]
public_ip_name          = "devopsautomation-publicip"
nic_name                = "devopsautomation-nic"
os_disk_name            = "devopsautomation-osdisk"
os_disk_storage_account = "Standard_LRS"
image_publisher         = "Canonical"
image_offer             = "UbuntuServer"
image_sku               = "18.04-LTS"
image_version           = "latest"
nsg_name                = "devopsautomation-nsg"

```

---

## Arquivo `modules/vm-linux/providers.tfvars`

```terraform
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "4.35.0"
    }
  }

  required_version = ">= 1.12.2"
}

provider "azurerm" {
  features {}
}

```
---

## Módulo: `modules/vm-linux/main.tf`

```terraform
data "azurerm_resource_group" "rg" {
  name = var.resource_group_name
}

resource "azurerm_network_security_group" "nsg" {
  name                = var.nsg_name
  location            = var.location
  resource_group_name = data.azurerm_resource_group.rg.name

  security_rule {
    name                       = "SSH"
    priority                   = 1001
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "22"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}

resource "azurerm_virtual_network" "vnet" {
  name                = var.vnet_name
  address_space       = var.vnet_address_space
  location            = var.location
  resource_group_name = data.azurerm_resource_group.rg.name
}

resource "azurerm_subnet" "subnet" {
  name                 = var.subnet_name
  resource_group_name  = data.azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = var.subnet_prefix
}

resource "azurerm_public_ip" "public_ip" {
  name                = var.public_ip_name
  location            = var.location
  resource_group_name = data.azurerm_resource_group.rg.name
  allocation_method   = "Static"
  sku                 = "Standard"

}

resource "azurerm_subnet_network_security_group_association" "subnet_nsg" {
  subnet_id                 = azurerm_subnet.subnet.id
  network_security_group_id = azurerm_network_security_group.nsg.id
}

resource "azurerm_network_interface" "nic" {
  name                = var.nic_name
  location            = var.location
  resource_group_name = data.azurerm_resource_group.rg.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.subnet.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.public_ip.id
  }

}

resource "azurerm_linux_virtual_machine" "vm" {
  name                            = var.vm_name
  resource_group_name             = data.azurerm_resource_group.rg.name
  location                        = var.location
  size                            = var.vm_size
  admin_username                  = var.admin_username
  admin_password                  = var.admin_password
  disable_password_authentication = false
  network_interface_ids           = [azurerm_network_interface.nic.id]

  os_disk {
    name                 = var.os_disk_name
    caching              = "ReadWrite"
    storage_account_type = var.os_disk_storage_account
  }

  source_image_reference {
    publisher = var.image_publisher
    offer     = var.image_offer
    sku       = var.image_sku
    version   = var.image_version
  }
}
```

---

## Módulo: `modules/vm-linux/variables.tf`

```terraform
variable "resource_group_name" {
  type        = string
  description = "value of the resource group name where the VM will be created"
}

variable "admin_username" {
  type        = string
  description = "value of the admin username for the VM"
}

variable "admin_password" {
  type        = string
  sensitive   = true
  description = "value of the admin password for the VM"
}

variable "location" {
  type        = string
  description = "value of the Azure region where the resources will be created"
}

variable "vm_name" {
  type        = string
  description = "value of the VM name"
}

variable "vm_size" {
  type        = string
  description = "value of the VM size"
}

variable "vnet_name" {
  type        = string
  description = "value of the virtual network name"
}

variable "vnet_address_space" {
  type        = list(string)
  description = "value of the virtual network address space"
}

variable "subnet_name" {
  type        = string
  description = "value of the subnet name"
}

variable "subnet_prefix" {
  type        = list(string)
  description = "value of the subnet prefix"
}

variable "public_ip_name" {
  type        = string
  description = "value of the public IP name"
}

variable "nic_name" {
  type        = string
  description = "value of the network interface name"
}

variable "os_disk_name" {
  type        = string
  description = "value of the OS disk name"
}

variable "os_disk_storage_account" {
  type        = string
  description = "value of the OS disk storage account type"
}

variable "image_publisher" {
  type        = string
  description = "value of the image publisher for the VM"
}

variable "image_offer" {
  type        = string
  description = "value of the image offer for the VM"
}

variable "image_sku" {
  type = string
}

variable "image_version" {
  type = string
}

variable "nsg_name" {
  type = string
}
```

---

## Módulo: `modules/vm-linux/outputs.tf`

```terraform
output "public_ip" {
  description = "Endereço IP público da VM"
  value       = azurerm_public_ip.public_ip.ip_address
}
```

---

## Comandos Terraform

### Inicializar

```bash
terraform init
```

### Planejar (usando terraform.tfvars)

```bash
terraform plan -var-file="terraform.tfvars"
```

### Aplicar (usando terraform.tfvars)

```bash
terraform apply -var-file="terraform.tfvars"
```

### Destruir (usando terraform.tfvars)

```bash
terraform destroy -var-file="terraform.tfvars"
```

---

## Resultado Esperado

* Criação de uma VM Linux Ubuntu 18.04 com IP público
* Infraestrutura modularizada e parametrizada

---

## Boas Práticas

* Sempre modularize recursos reutilizáveis
* Nunca exponha `admin_password` em arquivos versionados
* Use variáveis e `terraform.tfvars` para troca de ambientes
* Combine com backend remoto para maior segurança e colaboração