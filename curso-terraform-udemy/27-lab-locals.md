---
id: lab-9-locals
title: Lab 9 - Criando uma Storage Account no Azure com uso de `locals`
noindex: true
---

# Lab: Criando uma Storage Account no Azure com uso de `locals`

## Introdução
Neste laboratório, vamos criar uma Storage Account no Azure utilizando **Terraform 1.12.2** com o recurso `locals` para deixar o código mais limpo e reutilizável. Essa abordagem facilita a construção de nomes dinâmicos e evita repetições.

## Pré-requisitos
- Terraform 1.12.2 instalado
- Conta Azure autenticada com `az login`

## Etapas Iniciais
1. Crie o diretório e entre nele:
```bash
mkdir lab-storage-locals && cd lab-storage-locals
```

2. Crie os arquivos principais:
```bash
touch main.tf variables.tf outputs.tf provider.tf
```

3. Estrutura esperada:
```
lab-storage-locals/
├── main.tf
├── variables.tf
├── outputs.tf
├── provider.tf
```

## Arquivo: provider.tf
```terraform
provider "azurerm" {
  features {}
}
```

## Arquivo: variables.tf
```terraform
variable "environment" {
  description = "Ambiente de implantação"
  default     = "dev"
}

variable "location" {
  description = "Localização dos recursos"
  default     = "eastus"
}
```

## Arquivo: main.tf
```terraform
locals {
  resource_prefix = "app-${var.environment}"
  rg_name         = "${local.resource_prefix}-rg"
  sa_name         = "st${var.environment}${substr(md5(var.environment), 0, 4)}"
}

resource "azurerm_resource_group" "rg" {
  name     = local.rg_name
  location = var.location
}

resource "azurerm_storage_account" "storage" {
  name                     = local.sa_name
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = var.location
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

output "environment" {
  value = var.environment
}
```

## Comandos Terraform
```bash
terraform init
terraform plan
terraform apply
```

## Resultado Esperado
- Grupo de recursos e storage account criados com nomes baseados nos `locals`
- Exemplo de nomes:
  - Resource Group: `app-dev-rg`
  - Storage Account: `stdevxxxx`

## Destruindo os Recursos
Para remover todos os recursos criados pelo Terraform:
```bash
terraform destroy
```

## Dicas e Boas Práticas
- Use `locals` para centralizar nomes, sufixos, prefixos ou expressões reutilizadas
- Evite hardcode de nomes e repetições em múltiplos blocos
- Mantenha os `locals` simples e nomeados claramente

---
Este lab mostra como usar `locals` no Terraform para organizar melhor o código e gerar nomes dinâmicos reutilizáveis.
