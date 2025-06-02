---
sidebar_position: 1
title: "Como Validar Infraestrutura no Azure com Checkov e Terraform (Passo a Passo 2025)"
description: "Aprenda a utilizar o Checkov para validar sua infraestrutura como código no Azure com Terraform. Detecte falhas de segurança antes do deploy e crie ambientes mais seguros com análise estática. Tutorial completo em português para DevOps!"
keywords:
  - "checkov terraform azure"
  - "checkov validar infraestrutura azure"
  - "terraform azure segurança infraestrutura"
  - "checkov terraform pt-br"
  - "infraestrutura como codigo segura"
  - "checkov azure tutorial"
  - "checkov terraform análise estática"
---

Este tutorial demonstra como utilizar o Checkov para validar configurações inseguras em uma infraestrutura criada com Terraform no Azure.

---

### Requisitos

* Conta no Azure
* Terraform instalado
* Python instalado (se for instalar o Checkov via pip)
* Checkov instalado:

**Via pip:**

```bash
pip install checkov
```

**Via Docker:**

```bash
docker run -t -v $(pwd):/tf bridgecrew/checkov -d /tf
```

### Estrutura do Lab

Vamos provisionar:

* 1 Resource Group
* 1 Virtual Network + Subnet
* 1 NSG com a porta 22 aberta (SSH)
* 1 Network Interface
* 1 Linux Virtual Machine com senha habilitada (sem SSH key)

---

### Código Terraform (main.tf)

Crie um arquivo chamado `main.tf` com o seguinte conteúdo:

```hcl
provider "azurerm" {
  features {}
}

terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">= 3.0.0"
    }
  }
}

resource "azurerm_resource_group" "rg" {
  name     = "rg-checkov-vm"
  location = "eastus"
}

resource "azurerm_virtual_network" "vnet" {
  name                = "vnet-checkov"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
}

resource "azurerm_subnet" "subnet" {
  name                 = "subnet-checkov"
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_network_security_group" "nsg" {
  name                = "nsg-checkov"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  security_rule {
    name                       = "AllowSSH"
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

resource "azurerm_network_interface" "nic" {
  name                = "nic-checkov"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.subnet.id
    private_ip_address_allocation = "Dynamic"
  }
}

resource "azurerm_linux_virtual_machine" "vm" {
  name                = "vm-checkov"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  size                = "Standard_B1s"
  admin_username      = "azureuser"
  network_interface_ids = [
    azurerm_network_interface.nic.id,
  ]

  admin_password = "P@ssword1234!" # <- má prática proposital

  disable_password_authentication = false

  os_disk {
    name              = "disk-checkov"
    caching           = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "18.04-LTS"
    version   = "latest"
  }
}
```

### Executando o Terraform

```bash
terraform init
terraform apply -auto-approve
```

### Validando com o Checkov

Rode o Checkov no diretório com seu `main.tf`:

```bash
checkov -d .
```

O Checkov irá identificar várias falhas, como:

* SSH liberado para qualquer IP
* Uso de senha na VM
* Falta de NSG associada à subnet
* Ausência de autenticação por chave

### Criando o .checkov.yaml para ignorar regras

Para ignorar algumas falhas intencionais do lab, crie um arquivo chamado `.checkov.yaml` com o seguinte conteúdo:

```yaml
skip_checks:
  - CKV_AZURE_1
  - CKV_AZURE_10
  - CKV_AZURE_50
  - CKV_AZURE_149
  - CKV_AZURE_178
  - CKV2_AZURE_31
```

Rode novamente:

```bash
checkov -d .
```

### Limpeza do ambiente (opcional)

```bash
terraform destroy -auto-approve
```

---

### Referências

* [Checkov no GitHub](https://github.com/bridgecrewio/checkov)
* [Documentação da Azure Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)
