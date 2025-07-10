---
id: lab-3-for-each-count
title: Lab 3 - Criando Recursos em Lote com count e for_each no Terraform
noindex: true
---

# Lab: Criando Recursos em Lote com count e for_each no Terraform

## Introdução

Neste laboratório, vamos aprender a criar múltiplos recursos automaticamente usando `count` e `for_each`, dois recursos poderosos do Terraform. Vamos aplicar isso na criação de múltiplos resource groups na Azure.

---

# Parte 1: Criando Resource Groups com `count`

## Estrutura de Arquivos

```
lab-count-resource-groups/
├── main.tf
├── variables.tf
├── providers.tf
```

```bash
export ARM_SUBSCRIPTION_ID="subscription_id"
```

## `providers.tf`

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

## `variables.tf`

```terraform
variable "quantidade_de_grupos" {
  type    = number
  default = 3
}
```

## `main.tf`

```terraform
resource "azurerm_resource_group" "rg" {
  count    = var.quantidade_de_grupos
  name     = "rg-count-${count.index}"
  location = "East US"
}
```

## Comandos

```bash
terraform init
terraform plan
terraform apply
```

## Resultado Esperado

Criação de 3 resource groups com nomes:

* rg-count-0
* rg-count-1
* rg-count-2

> ⚠️ O uso do `count` é ideal quando queremos várias cópias idênticas de um recurso.

---

# Parte 2: Criando Resource Groups com `for_each`

## Estrutura de Arquivos

```
lab-foreach-resource-groups/
├── main.tf
├── variables.tf
├── providers.tf
```

## `variables.tf`

```terraform
variable "nomes_dos_grupos" {
  type    = list(string)
  default = ["dev", "staging", "prod"]
}
```

## `main.tf`

```terraform
resource "azurerm_resource_group" "rg" {
  for_each = toset(var.nomes_dos_grupos)

  name     = "rg-${each.key}"
  location = "East US"
}
```

## `providers.tf`

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

## Comandos

```bash
terraform init
terraform plan
terraform apply
```

## Resultado Esperado

Criação de 3 resource groups com nomes:

* rg-dev
* rg-staging
* rg-prod

> ✅ O `for_each` é mais flexível, ideal para dados nomeados e quando os recursos não são idênticos.

---

## Boas Práticas

* Prefira `for_each` quando for trabalhar com listas nomeadas ou mapas
* Use `count` apenas quando todos os recursos forem realmente idênticos
* Evite alterar a ordem de listas com `count` para não destruir e recriar recursos acidentalmente
* Sempre use `terraform plan` para visualizar as mudanças antes de aplicar