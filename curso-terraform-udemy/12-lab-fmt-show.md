---
id: lab-4-fmt-validate
title: Lab 4 - Mantendo a Qualidade do Código com fmt, validate e show no Terraform
noindex: true
---

# Lab: Mantendo a Qualidade do Código com `fmt`, `validate` e `show` no Terraform

## Introdução

Neste laboratório, vamos explorar comandos auxiliares do Terraform que ajudam a manter a qualidade do código: `terraform fmt`, `terraform validate` e `terraform show`. Esses comandos são essenciais para manter o código limpo, funcional e fácil de revisar.

## Pré-requisitos

* Terraform instalado (versão 1.12.2 ou superior)
* Azure CLI autenticada (`az login`)

---

```bash
export ARM_SUBSCRIPTION_ID="subscription_id"
```

## Estrutura de Arquivos

```
lab-fmt-validate-show/
├── main.tf
├── providers.tf
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

## Código propositalmente mal formatado em `main.tf`

```terraform
resource   "azurerm_resource_group"   "rg" {
   name="meu-grupo"
location="East US"
}
```

## Passo 1: Formatando o Código com `terraform fmt`

```bash
terraform fmt
```

Esse comando reescreve todos os arquivos `.tf` com identação padronizada. Não altera a lógica do código.

Código após `fmt`:

```terraform
resource "azurerm_resource_group" "rg" {
  name     = "meu-grupo"
  location = "East US"
}
```

---

## Passo 2: Validando o Código com `terraform validate`

### Código com erro em `main.tf`

```terraform
resource "azurerm_resource_group" "rg" {
  nome = "grupo-invalido"
  location = "East US"
}
```

### Rodando a validação

```bash
terraform validate
```

### Saída esperada

```text
│ Error: Unsupported argument
│   on main.tf line 2, in resource "azurerm_resource_group" "rg":
│   2:   nome = "grupo-invalido"
│
│ An argument named "nome" is not expected here.
```

### Corrigindo o erro

```terraform
resource "azurerm_resource_group" "rg" {
  name     = "grupo-valido"
  location = "East US"
}
```

### Validando novamente

```bash
terraform validate
```

### Saída esperada

```text
Success! The configuration is valid.
```

---

## Passo 3: Inspecionando com `terraform show`

Após rodar:

```bash
terraform init
terraform apply
```

Use:

```bash
terraform show
```

### Saída esperada (exemplo)

```text
# azurerm_resource_group.rg:
resource "azurerm_resource_group" "rg" {
  location = "East US"
  name     = "grupo-valido"
  id       = "/subscriptions/.../resourceGroups/grupo-valido"
}
```

### Analisando um plano salvo

```bash
terraform plan -out=tfplan
terraform show tfplan
```

---

## Boas Práticas

* Execute `terraform fmt` antes de commits para manter o código limpo
* Use `terraform validate` para evitar erros antes do `plan`
* Utilize `terraform show` para entender a infraestrutura provisionada
* Inclua esses comandos em pipelines de CI/CD

---

## Fluxo de Trabalho Recomendado

1. Escreva ou edite seu código
2. Rode `terraform fmt`
3. Rode `terraform validate`
4. Rode `terraform plan`
5. Rode `terraform apply`
6. Use `terraform show` para inspecionar