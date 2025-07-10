---
id: variaveis-outputs
title: Aula 3 - Deixando o Código Inteligente com Variáveis e Outputs
noindex: true
---

# Aula 3: Deixando o Código Inteligente com Variáveis e Outputs

---

## Introdução

Até agora, usamos valores fixos ("hardcoded") no nosso código Terraform. Mas o que acontece se quisermos reutilizar esse código em diferentes ambientes ou passar valores dinamicamente? É aqui que entram as **variáveis** e os **outputs**.

Eles são essenciais para tornar o código mais flexível, reutilizável e profissional.

---

## O que são Variáveis e Outputs?

* **Variáveis (`variable`)**: são os **parâmetros de entrada** do seu código. Permitem passar valores dinâmicos para os recursos.
* **Outputs (`output`)**: são os **valores de saída**. Exibem informações importantes após a criação da infraestrutura, como nomes, IPs ou URLs.

---

## Explicação Técnica

### Variáveis

As variáveis são declaradas usando o bloco `variable` em um arquivo separado (por convenção, `variables.tf`).

```hcl
# variables.tf
variable "nome_da_storage" {
  type        = string
  description = "Nome da Azure Storage Account"
  default     = "storagelab123456"
}
```

Para usar essa variável em um recurso:

```hcl
# main.tf
resource "azurerm_storage_account" "storage" {
  name                     = var.nome_da_storage
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}
```

### Outputs

Os outputs são declarados em um bloco `output` (geralmente no arquivo `outputs.tf`).

```hcl
# outputs.tf
output "endpoint_da_storage" {
  description = "URL da Azure Storage Account."
  value       = azurerm_storage_account.storage.primary_blob_endpoint
}
```

---

## Comandos de Referência

Crie os arquivos com o código acima e execute:

```bash
terraform init
terraform plan
terraform apply
```

---

## Exemplo Prático

### Estrutura dos arquivos:

**variables.tf**

```hcl
variable "nome_da_storage" {
  type        = string
  description = "Nome da Azure Storage Account"
  default     = "storagelab123456"
}
```

**main.tf**

```hcl
provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "rg-teste"
  location = "East US"
}

resource "azurerm_storage_account" "storage" {
  name                     = var.nome_da_storage
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}
```

**outputs.tf**

```hcl
output "endpoint_da_storage" {
  description = "URL da Azure Storage Account."
  value       = azurerm_storage_account.storage.primary_blob_endpoint
}
```

---

## Output Esperado

### `terraform plan`

```text
Terraform will perform the following actions:

  # azurerm_storage_account.storage will be created
  + name                     = "storagelab123456"
  + resource_group_name     = "rg-teste"
  + location                = "East US"
  + primary_blob_endpoint   = (known after apply)

Plan: 2 to add, 0 to change, 0 to destroy.
```

### `terraform apply`

```text
azurerm_resource_group.rg: Creating...
azurerm_storage_account.storage: Creating...
azurerm_storage_account.storage: Creation complete after 30s [id=/subscriptions/...]

Apply complete! Resources: 2 added, 0 changed, 0 destroyed.

Outputs:

endpoint_da_storage = "https://storagelab123456.blob.core.windows.net/"
```

---

## Melhores Práticas

* Separe variáveis em arquivos `variables.tf` para organizar melhor seu projeto
* Use `description` em todas as variáveis e outputs para facilitar a compreensão
* Evite hardcoded: use variáveis sempre que o valor puder mudar entre ambientes
* Os outputs ajudam a exportar dados entre módulos e para scripts externos
* Combine com `.tfvars` para facilitar a troca de ambientes (dev, prod, etc)
