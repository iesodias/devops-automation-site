---
id: tfvars
title: Aula 8 - Arquivos .tfvars no Terraform
noindex: true
---

# Arquivos `.tfvars` no Terraform

## Introdução

No Terraform, uma prática essencial é separar a **definição da infraestrutura** dos **valores das variáveis**. Isso é feito com os arquivos `.tfvars`, que permitem passar valores externos ao código principal. Essa abordagem é ideal para lidar com diferentes ambientes como desenvolvimento, homologacao e produção.

## O que é `.tfvars`

Arquivos `.tfvars` são arquivos onde você define valores para variáveis que foram declaradas nos arquivos `.tf`. Eles são usados para:

* Separar configurações específicas por ambiente
* Reutilizar o mesmo código com diferentes valores
* Evitar hardcode no código principal

## Explicação técnica

1. Você declara as variáveis no arquivo principal (`variables.tf`, por exemplo):

```hcl
variable "location" {
  type    = string
  default = "eastus"
}

variable "vm_size" {
  type = string
}
```

2. Cria arquivos `.tfvars` para cada ambiente:

### `dev.tfvars`

```hcl
location = "eastus"
vm_size  = "Standard_B1s"
```

### `hml.tfvars`

```hcl
location = "centralus"
vm_size  = "Standard_B2s"
```

### `prod.tfvars`

```hcl
location = "westeurope"
vm_size  = "Standard_D2s_v3"
```

3. Aplica usando:

```bash
terraform apply -var-file="dev.tfvars"
terraform apply -var-file="hml.tfvars"
terraform apply -var-file="prod.tfvars"
```

## Comandos

```bash
terraform init
terraform plan -var-file="dev.tfvars"
terraform apply -var-file="dev.tfvars"
```

## Exemplo prático

### Estrutura de arquivos:

```
main.tf
variables.tf
dev.tfvars
hml.tfvars
prod.tfvars
```

### `variables.tf`

```hcl
variable "location" {}
variable "vm_size" {}
```

### `main.tf`

```hcl
provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "rg-exemplo"
  location = var.location
}

resource "azurerm_linux_virtual_machine" "vm" {
  name                = "vm-exemplo"
  resource_group_name = azurerm_resource_group.rg.name
  location            = var.location
  size                = var.vm_size
  admin_username      = "azureuser"
  network_interface_ids = ["/subscriptions/xxx/.../nic"]

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
    name                 = "osdisk"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "22_04-lts"
    version   = "latest"
  }

  admin_ssh_key {
    username   = "azureuser"
    public_key = file("~/.ssh/id_rsa.pub")
  }

  disable_password_authentication = true
}
```

## Output esperado

```bash
Apply complete! Resources: 2 added, 0 changed, 0 destroyed.

Outputs:
azurerm_linux_virtual_machine.vm:
  name     = "vm-exemplo"
  location = "eastus"
  size     = "Standard_B1s"
```

## Melhores práticas

* Nunca comite arquivos `.tfvars` com dados sensíveis no Git
* Use nomes claros como `dev.tfvars`, `hml.tfvars`, `prod.tfvars`
* Separe lógicas do código e valores com o uso de variáveis
* Automatize a seleção do ambiente nos pipelines
* Use `default` apenas para valores comuns ou segurança

Arquivos `.tfvars` tornam seu código mais flexível e adaptável a diferentes contextos, facilitando o uso profissional do Terraform.
