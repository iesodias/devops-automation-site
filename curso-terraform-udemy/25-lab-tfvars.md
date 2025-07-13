---
id: lab-7-tfvars
title: Lab 7 - Criando uma Storage Account no Azure com uso de .tfvars
noindex: true
---
# Lab: Criando uma Storage Account no Azure com uso de .tfvars

## Introdução
Neste laboratório, vamos criar uma Storage Account no Azure usando Terraform 1.12.2, com separação de arquivos e definição de variáveis via um único arquivo `.tfvars`. Essa abordagem é útil quando estamos lidando com apenas um ambiente, como um cenário de teste ou desenvolvimento local.

```bash
export ARM_SUBSCRIPTION_ID="subscription_id"
```

## Pré-requisitos
- Terraform 1.12.2 instalado
- Conta Azure autenticada com `az login`

## Etapas Iniciais
1. Crie a estrutura de diretórios e arquivos:
```bash
mkdir lab-storage-tfvars && cd lab-storage-tfvars

touch main.tf variables.tf outputs.tf provider.tf terraform.tfvars
```

2. Verifique a estrutura com:
```bash
tree
```
Saída esperada:
```
lab-storage-tfvars/
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
  description = "Localização dos recursos"
  type        = string
}

variable "resource_group_name" {
  description = "Nome do Resource Group"
  type        = string
}

variable "storage_account_name" {
  description = "Nome da Storage Account"
  type        = string
}
```

## Arquivo: terraform.tfvars
```hcl
location             = "eastus"
resource_group_name  = "tfvars-storage-rg"
storage_account_name = "tfvarsstorage123"
```

## Arquivo: main.tf
```terraform
resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_storage_account" "storage" {
  name                     = var.storage_account_name
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}
```

## Arquivo: outputs.tf
```terraform
output "storage_account_name" {
  value = azurerm_storage_account.storage.name
}

output "resource_group_name" {
  value = azurerm_resource_group.rg.name
}

output "location" {
  value = azurerm_storage_account.storage.location
}
```

## Comandos Terraform
```bash
terraform init
terraform plan -var-file="terraform.tfvars"
terraform apply -var-file="terraform.tfvars"
```

## Resultado Esperado
- Um Resource Group e uma Storage Account criados com os valores definidos no `terraform.tfvars`
- Outputs mostrando nome da storage, RG e localização

## Dicas e Boas Práticas
- Nunca comite arquivos `.tfvars` com dados sensíveis
- Separe lógica (infraestrutura) de configuração (valores)
- Use arquivos `.tfvars` para facilitar execução com diferentes parâmetros

---
Este lab é ideal para testar configurações únicas com o Terraform, mantendo uma estrutura clara, reutilizável e separada por arquivos.
