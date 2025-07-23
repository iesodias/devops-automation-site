---
id: 22-lab-kevault
title: Lab 22 - Criando uma Máquina Virtual no Azure com senha armazenada no Key Vault usando Terraform
noindex: true
---
# Criando uma Máquina Virtual no Azure com Senha no Key Vault usando Terraform

## Introdução

Este laboratório mostra como criar uma máquina virtual Linux no Azure utilizando Terraform, mas com um diferencial de segurança: a senha da VM será armazenada de forma segura no **Azure Key Vault**, e recuperada dinamicamente no momento da execução. Isso evita que senhas sensíveis fiquem expostas em arquivos `.tf` ou `.tfvars` no repositório. Este tipo de prática é fundamental quando falamos de segurança em ambientes de infraestrutura como código.

---

## Estrutura de diretórios

```bash
mkdir vm-keyvault && cd vm-keyvault

touch main.tf variables.tf outputs.tf terraform.tfvars
```

---

## Comandos: Preparação com Azure CLI

Antes de rodar o Terraform, precisamos preparar o ambiente no Azure:

```bash
az group create --name rg-tf-vm-keyvault --location eastus

az keyvault create \
  --name kv-devopsautomation-lab \
  --resource-group rg-tf-vm-keyvault \
  --location eastus

az keyvault secret set \
  --vault-name kv-devopsautomation-lab \
  --name vmPassword \
  --value "SenhaSuperSegura123"
```

> ⚠️ Atenção: O segredo precisa ser criado manualmente. O Terraform vai apenas ler esse valor e aplicar na criação da VM.

---

## Arquivo `main.tf`

```hcl
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

data "azurerm_resource_group" "rg" {
  name = var.resource_group_name
}

data "azurerm_key_vault" "kv" {
  name                = var.key_vault_name
  resource_group_name = var.resource_group_name
}

data "azurerm_key_vault_secret" "vm_password" {
  name         = var.secret_name
  key_vault_id = data.azurerm_key_vault.kv.id
}

resource "azurerm_virtual_network" "vnet" {
  name                = "vnet"
  address_space       = ["10.0.0.0/16"]
  location            = var.location
  resource_group_name = data.azurerm_resource_group.rg.name
}

resource "azurerm_subnet" "subnet" {
  name                 = "subnet"
  resource_group_name  = data.azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_network_security_group" "nsg" {
  name                = "nsg"
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

resource "azurerm_subnet_network_security_group_association" "nsg_assoc" {
  subnet_id                 = azurerm_subnet.subnet.id
  network_security_group_id = azurerm_network_security_group.nsg.id
}

resource "azurerm_public_ip" "public_ip" {
  name                = "public-ip"
  location            = var.location
  resource_group_name = data.azurerm_resource_group.rg.name
  allocation_method   = "Static"
  sku                 = "Standard"
}

resource "azurerm_network_interface" "nic" {
  name                = "nic"
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
  location                        = var.location
  resource_group_name             = data.azurerm_resource_group.rg.name
  size                            = "Standard_B1s"
  admin_username                  = var.admin_username
  admin_password                  = data.azurerm_key_vault_secret.vm_password.value
  disable_password_authentication = false
  network_interface_ids           = [azurerm_network_interface.nic.id]

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

---

## Arquivo `variables.tf`

```hcl
variable "resource_group_name" { type = string }
variable "location" { type = string }
variable "key_vault_name" { type = string }
variable "secret_name" { type = string }
variable "vm_name" { type = string }
variable "admin_username" { type = string }
```

---

## Arquivo `outputs.tf`

```hcl
output "public_ip" {
  value       = azurerm_public_ip.public_ip.ip_address
  description = "IP público da VM"
}
```

---

## Arquivo `terraform.tfvars`

```hcl
resource_group_name = "rg-tf-vm-keyvault"
location            = "eastus"
key_vault_name      = "kv-devopsautomation-lab"
secret_name         = "vmPassword"
vm_name             = "vm-keyvault-demo"
admin_username      = "azureuser"
```

---

## Comandos Terraform

```bash
terraform init
terraform plan -var-file="terraform.tfvars"
terraform apply -var-file="terraform.tfvars"
```

---

## Output esperado

```txt
Apply complete! Resources: 6 added, 0 changed, 0 destroyed.

Outputs:
public_ip = "52.170.12.34"
```

---

## Conclusão

Esse laboratório demonstrou como criar uma VM segura no Azure utilizando Terraform e integrando o Azure Key Vault para armazenar a senha da VM. Essa abordagem reduz riscos de exposição de dados sensíveis e representa uma prática recomendada para ambientes profissionais. Além disso, reforça o conceito de separação de responsabilidades: a infraestrutura é declarada com Terraform, e os segredos são gerenciados de forma segura pelo Key Vault.

Na próxima aula, você poderá experimentar acessar essa VM usando SSH com a senha segura ou ajustar o provisionamento para usar chaves públicas e privadas.
