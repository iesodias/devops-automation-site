---
id: lab-8-ws
title: Lab 8 - Criando uma Storage Account no Azure usando Terraform Workspaces
noindex: true
---
# Lab: Criando uma Storage Account no Azure usando Terraform Workspaces

## Introdução
Neste laboratório, vamos criar uma Storage Account no Azure utilizando **Terraform 1.12.2** e **workspaces** para isolar ambientes (dev, hml e prod). Cada workspace terá seu próprio estado, permitindo reaproveitar o mesmo código com recursos diferentes por ambiente.

## Pré-requisitos
- Terraform 1.12.2 instalado
- Conta Azure autenticada com `az login`

```bash
export ARM_SUBSCRIPTION_ID="subscription_id"
```

## Etapas Iniciais
1. Crie o diretório e entre nele:
```bash
mkdir lab-storage-ws && cd lab-storage-ws
```

2. Crie os arquivos básicos do Terraform:
```bash
touch main.tf variables.tf outputs.tf provider.tf
```

3. Estrutura esperada:
```
lab-storage-ws/
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
variable "location" {
  description = "Localização dos recursos"
  default     = "eastus"
}
```

## Arquivo: main.tf
```terraform
resource "azurerm_resource_group" "rg" {
  name     = "rg-${terraform.workspace}"
  location = var.location
}

resource "azurerm_storage_account" "storage" {
  name                     = "st${terraform.workspace}acc${substr(md5(terraform.workspace), 0, 4)}"
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

output "workspace" {
  value = terraform.workspace
}
```

## Comandos Terraform
```bash
terraform init

terraform workspace new dev
terraform workspace select dev
terraform apply

terraform workspace new hml
terraform workspace select hml
terraform apply

terraform workspace new prod
terraform workspace select prod
terraform apply
```

## Resultado Esperado
- Um resource group e uma storage account criados por ambiente
- Recursos separados com base no nome do workspace ativo

Exemplo de nomes:
- Resource Group: `rg-dev`, `rg-hml`, `rg-prod`
- Storage Account: `stdevaccxxxx`, `sthmlaccxxxx`, `stprodaccxxxx`

## Dicas e Boas Práticas
- Use `terraform.workspace` para personalizar recursos por ambiente
- Sempre verifique o workspace ativo com `terraform workspace show`
- Evite usar workspaces para isolar projetos diferentes — ideal apenas para ambientes
- Mantenha a estrutura de arquivos simples e reutilizável

## Destruindo os Ambientes
Para remover os recursos criados, basta selecionar o workspace correspondente e executar o comando `destroy`:

```bash
terraform workspace select dev
terraform destroy -auto-approve

terraform workspace select hml
terraform destroy -auto-approve

terraform workspace select prod
terraform destroy -auto-approve
```

## Dicas e Boas Práticas
- Use `terraform.workspace` para personalizar recursos por ambiente
- Sempre verifique o workspace ativo com `terraform workspace show`
- Evite usar workspaces para isolar projetos diferentes — ideal apenas para ambientes
- Mantenha a estrutura de arquivos simples e reutilizável

---
Este lab mostra como usar Terraform Workspaces para gerenciar múltiplos ambientes com o mesmo código, mantendo estados isolados e a infraestrutura organizada.
