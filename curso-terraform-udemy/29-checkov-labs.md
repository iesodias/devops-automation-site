---
id: lab-11-checkov
title: Lab 11 - Criando uma VM e validando com Checkov
noindex: true
---

# Lab: Criando uma VM e validando com Checkov

## Introdução
Este laboratório tem como objetivo provisionar uma máquina virtual no Azure com o **mínimo de recursos necessários** para facilitar a validação com a ferramenta **Checkov**. Ideal para ambientes de teste com foco em segurança e conformidade.

## Etapas Iniciais
Crie a estrutura de diretórios e arquivos:

```bash
mkdir lab-checkov && cd lab-checkov

touch main.tf provider.tf variables.tf outputs.tf terraform.tfvars
```

## Estrutura do Projeto
```
lab-vm-checkov/
├── main.tf
├── outputs.tf
├── provider.tf
├── variables.tf
└── terraform.tfvars
```

## provider.tf
```terraform
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
```

## terraform.tfvars
```hcl
# SSH será lido diretamente do arquivo local ~/.ssh/id_rsa.pub
```

## main.tf
```terraform
locals {
  prefix = "vm-checkov-simple"
}

resource "azurerm_resource_group" "rg" {
  name     = "${local.prefix}-rg"
  location = var.location
}

resource "azurerm_network_interface" "nic" {
  name                = "${local.prefix}-nic"
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = "fake-subnet-id" # substitua por subnet real se necessário
    private_ip_address_allocation = "Dynamic"
  }
}

resource "azurerm_linux_virtual_machine" "vm" {
  name                = "${local.prefix}-vm"
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name
  size                = "Standard_B1s"
  admin_username      = var.admin_username
  disable_password_authentication = false

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

## outputs.tf
```terraform
output "vm_name" {
  value = azurerm_linux_virtual_machine.vm.name
}
```

## Comandos Terraform
```bash
terraform init
```

## Validação com Checkov
```bash
checkov -d .
```

## Criar arquivo de exceções para Checkov (se necessário)
Crie um arquivo `.checkov.ignore` no diretório do projeto com os códigos de política que você deseja ignorar:

```bash
touch .checkov.yaml
```

Exemplo de conteúdo do `.checkov.yaml`:

```text
skip-check:
  - CKV_AZURE_149
  - CKV_AZURE_1
```

## Validação com Checkov
```bash
checkov -d .
```

Este arquivo será automaticamente lido pelo Checkov e as regras listadas serão ignoradas nos relatórios.

## Resultado Esperado
- Código limpo sem alertas

## Boas Práticas
- Use o mínimo necessário para ambiente de testes
- Sempre valide sua infraestrutura com ferramentas como Checkov
- Remova recursos desnecessários para reduzir superfície de ataque

---

