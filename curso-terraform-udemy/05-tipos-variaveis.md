---
id: tipos-variaveis
title: Aula 4 - Tipos de Variáveis no Terraform
noindex: true
---

# Aula 4: Tipos de Variáveis no Terraform

---

## Introdução

No Terraform, as variáveis podem ter **vários tipos de dados**, o que permite criar códigos mais robustos, seguros e reutilizáveis. Definir corretamente o tipo de variável ajuda a evitar erros e a documentar melhor o comportamento esperado.

---

## O que são Tipos de Variáveis?

São as **categorias de dados** que uma variável pode receber. Com elas, o Terraform valida automaticamente se os valores estão corretos.

Dividem-se em:

### Tipos Primitivos

* `string`: qualquer texto entre aspas (`"meu texto"`)
* `number`: números inteiros ou decimais (`10`, `3.14`)
* `bool`: valores booleanos (`true` ou `false`)

### Tipos de Coleção

* `list(<tipo>)`: lista ordenada de elementos (`["a", "b", "c"]`)
* `map(<tipo>)`: chave-valor com valores do mesmo tipo (`{"chave" = "valor"}`)
* `object({ chave = tipo, ... })`: estrutura com chaves e tipos definidos

---

## Explicação Técnica

Ao definir uma variável, podemos usar o argumento `type` para especificar o tipo de dado. Isso ajuda o Terraform a:

* Validar automaticamente a entrada
* Gerar mensagens de erro claras
* Garantir que o recurso receba o formato correto

---

## Comandos de Referência

Crie os arquivos de variáveis e recursos, e use os comandos:

```bash
terraform init
terraform plan
terraform apply
```

---

## Exemplo Prático: map(string) para Tags (Azure)

### variables.tf

```hcl
variable "tags_padrao" {
  type        = map(string)
  description = "Tags que serão aplicadas em todos os recursos."
  default = {
    "Projeto"      = "Curso Terraform"
    "Ambiente"     = "Desenvolvimento"
    "GerenciadoPor" = "Terraform"
  }
}

variable "nome_da_storage" {
  type        = string
  default     = "storagetiposvariaveis"
}
```

### main.tf

```hcl
provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "rg-tipos"
  location = "East US"
  tags     = var.tags_padrao
}

resource "azurerm_storage_account" "storage" {
  name                     = var.nome_da_storage
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  tags                     = var.tags_padrao
}
```

---

## Output Esperado

### `terraform plan`

```text
Terraform will perform the following actions:

  # azurerm_resource_group.rg will be created
  + name     = "rg-tipos"
  + location = "East US"
  + tags     = {
      + "Ambiente"      = "Desenvolvimento"
      + "GerenciadoPor" = "Terraform"
      + "Projeto"       = "Curso Terraform"
    }

  # azurerm_storage_account.storage will be created
  + name                     = "storagetiposvariaveis"
  + resource_group_name      = "rg-tipos"
  + location                 = "East US"
  + tags                     = {
      + "Ambiente"      = "Desenvolvimento"
      + "GerenciadoPor" = "Terraform"
      + "Projeto"       = "Curso Terraform"
    }

Plan: 2 to add, 0 to change, 0 to destroy.
```

---

## Melhores Práticas

* Sempre defina o `type` nas variáveis para evitar erros de digitação
* Use `map(string)` para organizar **tags** e **parâmetros reutilizáveis**
* Prefira `list` para listas de valores como zonas, IPs ou nomes de recursos
* Use `object` para estruturas aninhadas com validação mais rígida
* Separe variáveis por tipo em arquivos diferentes se o projeto crescer

---

## Referência Oficial

Para mais detalhes, consulte a documentação oficial da HashiCorp:
🔗 [https://developer.hashicorp.com/terraform/language/values/variables](https://developer.hashicorp.com/terraform/language/values/variables)
