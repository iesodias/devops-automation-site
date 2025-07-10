---
id: lab-2-variables-output
title: Lab - Variáveis e Outputs no Terraform
noindex: true
---

# Lab: Variáveis e Outputs no Terraform

## Introdução

Neste laboratório, vamos aprender a utilizar **variáveis** e **outputs** no Terraform. Primeiro, faremos a criação de um recurso Azure com valores fixos (hardcoded). Em seguida, refatoraremos o código usando variáveis para torná-lo mais flexível e reutilizável.

## Pré-requisitos

* Terraform instalado (versão 1.12.2)
* Conta na Azure com permissões para criar recursos
* Azure CLI autenticada (`az login`)

## Etapa 1: Criar recurso com valores fixos

### Estrutura de Arquivo

```
terraform-variaveis-lab/
├── main.tf
```

```bash
export ARM_SUBSCRIPTION_ID="subscription_id"
```

### Conteúdo do `main.tf`

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

resource "azurerm_resource_group" "rg" {
  name     = "rg-teste"
  location = "East US"
}

resource "azurerm_storage_account" "storage" {
  name                     = "storagelab123456"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

output "endpoint_da_storage" {
  description = "URL da Azure Storage Account."
  value       = azurerm_storage_account.storage.primary_blob_endpoint
}
```

### Comandos Terraform

```bash
terraform init
terraform plan
terraform apply
```

### Resultado Esperado

```
Apply complete! Resources: 2 added, 0 changed, 0 destroyed.

Outputs:
endpoint_da_storage = "https://storagelab123456.blob.core.windows.net/"
```

## Etapa 2: Refatorar usando variáveis

### Estrutura de Arquivo

```
terraform-variaveis-lab/
├── main.tf
├── variables.tf
├── outputs.tf
```

### `variables.tf`

```terraform
variable "nome_da_storage" {
  type        = string
  description = "Nome da Azure Storage Account"
  default     = "storagelab123456"
}
```

### `main.tf`

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

resource "azurerm_resource_group" "rg" {
  name     = "rg-teste"
  location = "East US"
}

resource "azurerm_storage_account" "storage" {
  name                     = var.nome_da_storage
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}
```

### `outputs.tf`

```terraform
output "endpoint_da_storage" {
  description = "URL da Azure Storage Account."
  value       = azurerm_storage_account.storage.primary_blob_endpoint
}
```

### Comandos Terraform

```bash
terraform init
terraform plan
terraform apply
```

### Resultado Esperado

```
Apply complete! Resources: 2 added, 0 changed, 0 destroyed.

Outputs:
endpoint_da_storage = "https://storagelab123456.blob.core.windows.net/"
```

> ✅ **Boas práticas:**
>
> * Separe `main.tf`, `variables.tf` e `outputs.tf` para melhor organização.
> * Use `terraform.tfvars` para valores específicos por ambiente.
> * Prefira variáveis com `description` e `type` para validação e documentação.
