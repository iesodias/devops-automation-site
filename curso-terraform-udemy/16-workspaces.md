---
id: workspaces
title: Aula 9 - Workspaces no Terraform
noindex: true
---

# Workspaces no Terraform

## Introdução

Os **workspaces** no Terraform permitem que você utilize o mesmo conjunto de código para gerenciar vários ambientes de forma isolada, como `dev`, `hml` e `prod`. Cada workspace possui seu próprio estado independente, o que evita conflitos entre ambientes.

Essa abordagem é muito últil quando você quer reaproveitar a mesma infraestrutura, mas separando os dados e aplicações por ambiente.

## O que é um Workspace

Um workspace é uma instância do estado do Terraform. Por padrão, você está no workspace `default`. Ao criar novos workspaces, o Terraform cria um estado separado para cada um, permitindo gerenciar recursos distintos com o mesmo código.

## Explicação técnica

* Cada workspace é associado a um arquivo de estado independente
* O nome do workspace pode ser usado dentro do código com `terraform.workspace`
* Ideal para projetos pequenos ou médios com ambientes bem separados
* Não é substituto de repositórios ou pipelines separados, mas é uma opção válida para organizar estados

## Comandos

```bash
terraform workspace list
terraform workspace new dev
terraform workspace new hml
terraform workspace new prod

terraform workspace select dev
terraform plan
terraform apply
```

## Exemplo prático

### `main.tf`

```hcl
variable "location" {
  default = "eastus"
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "rg-${terraform.workspace}"
  location = var.location
}
```

### Etapas no terminal

```bash
terraform init
terraform workspace new dev
terraform apply

terraform workspace new prod
terraform apply
```

## Output esperado

```bash
Apply complete! Resources: 1 added, 0 changed, 0 destroyed.

Outputs:
azurerm_resource_group.rg:
  name     = "rg-dev"
  location = "eastus"
```

Ao mudar para o workspace `prod`:

```bash
Apply complete! Resources: 1 added, 0 changed, 0 destroyed.

Outputs:
azurerm_resource_group.rg:
  name     = "rg-prod"
  location = "eastus"
```

## Melhores práticas

* Use nomes consistentes para ambientes (`dev`, `hml`, `prod`)
* Sempre verifique o workspace ativo com `terraform workspace show`
* Combine com `terraform.workspace` no código para diferenciar recursos
* Não use workspaces para isolação de times ou projetos distintos
* Evite misturar com backends que já segmentam por ambiente (como buckets separados)

Workspaces são ótimos aliados quando você precisa reaproveitar código com ambientes diferentes sem complicar a estrutura do projeto.
