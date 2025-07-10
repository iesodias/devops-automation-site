---
id: locals
title: Aula 10 - Variáveis `locals` no Terraform
noindex: true
---

# Variáveis `locals` no Terraform

## Introdução

O Terraform permite criar **variáveis locais** com o bloco `locals`, que são ótimas para organizar e reaproveitar valores dentro do mesmo módulo. Elas ajudam a deixar o código mais limpo, evitando repetições e facilitando manutenção.

## O que é o bloco `locals`

O bloco `locals` define variáveis que são usadas **apenas dentro do escopo atual**. Elas não podem ser passadas como entrada nem exportadas como saída. São ótimas para calcular valores, construir strings, ou definir padrões reutilizáveis.

## Explicação técnica

* O bloco `locals` é definido com `locals {}`
* Pode conter uma ou mais variáveis locais
* Acessadas com `local.<nome>`
* Podem conter expressões, concatenações, condições e chamadas de funções

## Comando(s)

```bash
terraform init
terraform plan
terraform apply
```

## Exemplo prático

### `main.tf`

```hcl
locals {
  environment     = "dev"
  resource_prefix = "app-${local.environment}"
  location        = "eastus"
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "${local.resource_prefix}-rg"
  location = local.location
}
```

Esse código cria um grupo de recursos chamado `app-dev-rg` na região `eastus`, reutilizando os valores definidos nos locals.

## Output esperado

```bash
Apply complete! Resources: 1 added, 0 changed, 0 destroyed.

Outputs:
azurerm_resource_group.rg:
  name     = "app-dev-rg"
  location = "eastus"
```

## Melhores práticas

* Use `locals` para evitar repetições de strings e expressões
* Nomeie os locals de forma clara e sem ambiguidade
* Evite colocar lógicas complexas demais nos `locals` — mantenha simples
* Combine com `terraform.workspace` para gerar nomes dinâmicos por ambiente

As variáveis locais são ideais para manter o código organizado e DRY (Don't Repeat Yourself). Elas são amplamente usadas em módulos e projetos de médio a grande porte no Terraform.
