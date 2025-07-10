---
id: foreach-count
title: Aula 5 - Criando Recursos em Lote com count e for_each
noindex: true
---

# Aula 5: Criando Recursos em Lote com count e for_each

---

## Introdução

Repetir blocos de código para criar vários recursos é ineficiente e propenso a erros. O Terraform resolve isso com dois recursos poderosos: **`count`** e **`for_each`**.

Essas estruturas permitem criar **várias instâncias de um recurso automaticamente**, com menos código e mais controle.

---

## O que são count e for\_each?

* `count`: permite criar um número fixo de cópias idênticas de um recurso.
* `for_each`: permite iterar sobre listas ou mapas, criando recursos personalizados com base nos valores.

O `for_each` é geralmente mais flexível e recomendado.

---

## Explicação Técnica

### count

* Recebe um número inteiro.
* Gera recursos com base em um índice numérico (`count.index`).

```hcl
resource "azurerm_resource_group" "rg" {
  count    = 3
  name     = "rg-${count.index}"
  location = "East US"
}
```

### for\_each

* Itera sobre listas ou mapas (convertidos em `set` ou `map`).
* Usa `each.key` e `each.value` dentro do bloco para acessar os dados.

```hcl
variable "nomes_dos_grupos" {
  type    = list(string)
  default = ["dev", "staging", "prod"]
}

resource "azurerm_resource_group" "grupos" {
  for_each = toset(var.nomes_dos_grupos)

  name     = "rg-${each.key}"
  location = "East US"
}
```

---

## Comandos de Referência

```bash
terraform init
terraform plan
terraform apply
```

---

## Exemplo Prático com for\_each

### variables.tf

```hcl
variable "nomes_dos_grupos" {
  type    = list(string)
  default = ["dev", "staging", "prod"]
}
```

### main.tf

```hcl
provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "grupos" {
  for_each = toset(var.nomes_dos_grupos)

  name     = "rg-${each.key}"
  location = "East US"
}
```

---

## Output Esperado

### `terraform plan`

```text
Terraform will perform the following actions:

  # azurerm_resource_group.grupos["dev"] will be created
  + name = "rg-dev"

  # azurerm_resource_group.grupos["staging"] will be created
  + name = "rg-staging"

  # azurerm_resource_group.grupos["prod"] will be created
  + name = "rg-prod"

Plan: 3 to add, 0 to change, 0 to destroy.
```

### `terraform apply`

```text
Apply complete! Resources: 3 added, 0 changed, 0 destroyed.
```

---

## Melhores Práticas

* Prefira `for_each` quando os dados forem mais complexos ou se precisar de nomes personalizados
* Use `toset()` ao aplicar `for_each` a listas
* Não altere a ordem de itens em listas se estiver usando `count` — isso pode causar destruição e recriação de recursos
* Use `map` com `for_each` quando quiser mais controle sobre `each.key` e `each.value`

---

Com `count` e `for_each`, você ganha poder e flexibilidade para criar estruturas repetidas sem repetir código. Ideal para ambientes grandes ou dinâmicos!
