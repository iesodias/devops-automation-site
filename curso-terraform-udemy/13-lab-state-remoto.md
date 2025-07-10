---
id: lab-5-tfstate-remoto
title: Lab 5 - Utilizando Backend Remoto com Azure Blob Storage no Terraform
noindex: true
---

# Lab: Utilizando Backend Remoto com Azure Blob Storage no Terraform

## Introdução

Neste laboratório, vamos configurar o Terraform para utilizar um backend remoto no Azure, armazenando o arquivo de estado (`terraform.tfstate`) em um Blob Storage seguro. Isso é essencial para ambientes colaborativos e para proteger informações sensíveis.

## Pré-requisitos

* Terraform instalado (versão 1.12.2 ou superior)
* Azure CLI instalada e autenticada (`az login`)

---

```bash
export ARM_SUBSCRIPTION_ID="subscription_id"
```

## Etapa 1: Criar infraestrutura de backend com Azure CLI

Execute os comandos abaixo para criar os recursos necessários:

```bash
az login

az group create -n rg-devopsautomation -l eastus

az storage account create \
  --name labdevopsautomation \
  --resource-group rg-devopsautomation \
  --sku Standard_LRS \
  --encryption-services blob

az storage container create \
  --name tfstate \
  --account-name labdevopsautomation \
  --auth-mode login
```

---

## Etapa 2: Estrutura dos arquivos Terraform

```
lab-backend-remoto/
├── main.tf
├── backend.tf
├── providers.tf
```

## `backend.tf`

```terraform
terraform {
  backend "azurerm" {
    resource_group_name  = "rg-devopsautomation"
    storage_account_name = "labdevopsautomation"
    container_name       = "tfstate"
    key                  = "lab/resource-group.tfstate"
  }
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

## `main.tf`

```terraform
resource "azurerm_resource_group" "rg" {
  name     = "rg-backend-remoto"
  location = "East US"
}
```

---

## Etapa 3: Inicializar com backend remoto

```bash
terraform init
```

### Output esperado:

```text
Initializing the backend...
Successfully configured the backend "azurerm"!
Terraform will use the remote backend from now on.
```

---

## Etapa 4: Executar o plano e aplicar

```bash
terraform plan
terraform apply
```

### Output esperado:

```text
Acquiring state lock. This may take a few moments...
...
Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
```

---

## Boas Práticas

* Nunca versionar o arquivo `terraform.tfstate`
* Use RBAC e políticas no container de storage
* Ative logging e criptografia no Azure
* Nomeie arquivos `key` de forma clara por ambiente (ex: `dev/main.tfstate`)

---

## Limpeza do Ambiente

Para remover o recurso criado pelo Terraform:

```bash
terraform destroy
```

> Confirme com `yes` quando solicitado.

Para remover a infraestrutura do backend remoto (grupo de recursos, storage account e container):

```bash
az group delete --name rg-devopsautomation --yes --no-wait
```

> ⚠️ Esse comando é irreversível e excluirá todos os recursos dentro do grupo, incluindo o estado remoto.