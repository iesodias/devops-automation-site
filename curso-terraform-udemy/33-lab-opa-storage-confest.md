---
id: lab-15-confest-opa
title: Lab 15 - Impedindo Instâncias Caras com OPA/Conftest no Terraform
noindex: trues
---

# Lab: Impedindo Instâncias Caras com OPA/Conftest no Terraform

## Introdução
Este laboratório demonstra como usar o **OPA (Open Policy Agent)** com a ferramenta **Conftest** para prevenir a criação de instâncias caras no Azure usando Terraform. Isso permite aplicar políticas de custo e segurança diretamente no fluxo de trabalho de infraestrutura como código.

## Etapas Iniciais
Crie a estrutura de diretórios e arquivos:

```bash
mkdir -p lab-opa-vm/policies && cd lab-opa-vm

touch main.tf provider.tf variables.tf terraform.tfvars
cd policies && touch deny_expensive_instances.rego
cd ..
```

## Estrutura do Projeto
```
lab-opa-vm/
├── main.tf
├── provider.tf
├── variables.tf
├── terraform.tfvars
└── policies
    └── deny_expensive_instances.rego
```

## provider.tf
```terraform
terraform {
  required_version = ">= 1.12.2"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">= 2.0"
    }
  }
}

provider "azurerm" {
  features {}
}
```

## variables.tf
```terraform
variable "location" {
  default = "eastus"
}

variable "admin_username" {
  default = "azureuser"
}

variable "vm_size" {
  description = "Tamanho da máquina virtual"
  default     = "Standard_D4s_v3"
}
```

## terraform.tfvars
```hcl
vm_size = "Standard_D4s_v3"

```

## main.tf
```terraform
terraform {
  required_version = ">= 1.12.2"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">= 2.0"
    }
  }
}

provider "azurerm" {
  features {}
}
resource "azurerm_resource_group" "rg" {
  name     = "opa-rg"
  location = var.location
}

resource "azurerm_virtual_network" "vnet" {
  name                = "opa-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name
}

resource "azurerm_subnet" "subnet" {
  name                 = "opa-subnet"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_network_interface" "nic" {
  name                = "opa-nic"
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.subnet.id
    private_ip_address_allocation = "Dynamic"
  }
}

resource "azurerm_linux_virtual_machine" "vm" {
  name                = "opa-vm"
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name
  size                = var.vm_size
  admin_username      = var.admin_username
  disable_password_authentication = true

  network_interface_ids = [azurerm_network_interface.nic.id]

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
    name                 = "osdisk"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "22.04-LTS"
    version   = "latest"
  }

  admin_ssh_key {
    username   = var.admin_username
    public_key = file("~/.ssh/id_rsa.pub")
  }
}
```

## output.tf
```hcl
output "vm_name" {
  value = azurerm_linux_virtual_machine.vm.name
}
```

## policies/deny_expensive_instances.rego
```rego
package main

import rego.v1

deny contains msg if {
  some i
  resource := input.planned_values.root_module.resources[i]
  resource.type == "azurerm_linux_virtual_machine"
  flavors := {"Standard_D4s_v3", "Standard_D8s_v3"}
  flavors[resource.values.size]
  msg := sprintf("Uso de instância cara (%s) não permitido.", [resource.values.size])
}

```

## Comandos para Executar
```bash
terraform init
terraform plan -out=tfplan.binary
terraform show -json tfplan.binary > tfplan.json
conftest test tfplan.json --policy policy
```

## Resultado Esperado
O Conftest deve bloquear o uso da instância cara com a mensagem:

```bash
conftest test tfplan.json --policy policy

FAIL - tfplan.json - main.deny[0]: Uso de instância cara (Standard_D4s_v3) não permitido.
```
## Resultado Esperado após alteração
```bash
conftest test tfplan.json --policy policy

1 test, 1 passed, 0 warnings, 0 failures, 0 exceptions
```
## Boas Práticas
- Use políticas OPA para prevenir uso indevido de recursos
- Integre com pipelines para validação automática
- Centralize políticas em repositórios gerenciados

---
Este laboratório mostra como prevenir erros de custo com validação preventiva baseada em políticas. Ideal para times de DevOps e FinOps.
