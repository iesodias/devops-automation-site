---
id: lab-16-confest-opa
title: Lab 16 - Aplicando Políticas OPA/Conftest para Storage Account no Azure
noindex: trues
---
# Lab: Aplicando Políticas OPA/Conftest para Storage Account no Azure

## Introdução
Este lab demonstra como criar um Resource Group e uma Storage Account no Azure com Terraform 1.12.2, utilizando **OPA/Conftest** para validar regras de conformidade.

## Objetivo
Criar:
- 1 Resource Group chamado `devopsautomation-rg`
- 1 Storage Account
E aplicar validações com **OPA/Conftest** para garantir boas práticas.

## Estrutura de arquivos
```bash
mkdir -p lab-opa-storage/policies && cd lab-opa-storage

touch main.tf variables.tf outputs.tf provider.tf terraform.tfvars
cd policies && touch storage_policy.rego && cd ..
```

### Estrutura esperada
```
lab-opa-storage/
├── main.tf
├── outputs.tf
├── provider.tf
├── variables.tf
├── terraform.tfvars
└── policies
    └── storage_policy.rego
```

---

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

variable "resource_group_name" {
  default = "devopsautomation-rg"
}

variable "storage_account_name" {
  default = "devopsautostore01"
}
```

## terraform.tfvars
```hcl
# Override opcional
```

## main.tf
```terraform
resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_storage_account" "storage" {
  name                     = var.storage_account_name
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  blob_properties {
    delete_retention_policy {
      days = 7
    }
  }

  network_rules {
    default_action             = "Allow"
    bypass                    = ["AzureServices"]
  }

  # Simulação de erro proposital para OPA (HTTPS desabilitado)
  min_tls_version             = "TLS1_0"  # má prática
}
```

## outputs.tf
```terraform
output "storage_account_name" {
  value = azurerm_storage_account.storage.name
}

output "resource_group_name" {
  value = azurerm_resource_group.rg.name
}
```

---

## policies/storage_policy.rego
```rego
package main

import rego.v1

deny contains msg if {
  some i
  resource := input.planned_values.root_module.resources[i]
  resource.type == "azurerm_storage_account"
  not resource.values.enable_https_traffic_only
  msg := "Storage Account deve ter HTTPS habilitado."
}
```

---

## Comandos Terraform e OPA/Conftest
```bash
terraform init
terraform plan -out=tfplan.binary
terraform show -json tfplan.binary > tfplan.json
conftest test tfplan.json --policy policies
```

## Resultado Esperado
O Conftest deve emitir:
```
FAIL - tfplan.json - main.deny[0]: Storage Account deve usar TLS 1.2 ou superior.
```

---

## Dicas e Boas Práticas
- Sempre use `min_tls_version = "TLS1_2"` ou superior
- Centralize regras OPA no repositório de infraestrutura
- Integre Conftest no CI/CD para prevenir aplicações inseguras

---
Este laboratório permite validar configurações sensíveis com OPA/Conftest antes do `apply`, promovendo conformidade e segurança desde o desenvolvimento.
