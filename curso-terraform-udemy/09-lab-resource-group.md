---
id: lab-1-rg
title: Lab 1 - Criando um Resource Group no Azure com Terraform
noindex: true
---

# Lab: Criando um Resource Group no Azure com Terraform

## Introdução

Neste lab, vamos criar um Resource Group no Microsoft Azure utilizando Terraform. O objetivo é entender os primeiros passos da infraestrutura como código e preparar o ambiente para futuras implementações.

## Pré-requisitos

* Terraform instalado (versão 1.12.2)
* Conta na Azure com permissões para criar recursos
* Azure CLI instalada e autenticada (`az login`)
* Variável de ambiente com ID da assinatura configurada:

```bash
export ARM_SUBSCRIPTION_ID="subscription_id"
```

Substitua `subscription_id` pelo ID real da sua assinatura Azure.

## Estrutura esperada de arquivos

```
terraform-lab-resource-group/
├── main.tf
```

## Conteúdo do arquivo `main.tf`

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

resource "azurerm_resource_group" "exemplo" {
  name     = "rg-lab-terraform"
  location = "East US"
}
```

## Comandos Terraform

### 1. Inicializar o diretório do projeto

```bash
terraform init
```

Esse comando prepara o diretório para uso com Terraform, baixando os plugins necessários (como o provider da Azure).

### 2. Planejar a execução

```bash
terraform plan
```

Esse comando mostra o que o Terraform irá fazer sem aplicar nenhuma mudança. Ótimo para revisar antes de executar.

### 3. Aplicar o plano

```bash
terraform apply
```

Esse comando aplica as mudanças e cria o resource group no Azure. Confirme com `yes` quando solicitado.

### 4. Destruir os recursos criados

```bash
terraform destroy
```

Esse comando remove todos os recursos que foram criados pelo Terraform. Confirme com `yes` quando solicitado.

> ⚠️ **Atenção:** É sempre recomendado destruir os recursos após o término dos testes para evitar cobranças inesperadas na sua conta Azure.

## Resultado Esperado

Após a execução do `terraform apply`, você deverá ver uma mensagem como:

```
Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
```

E o resource group "rg-lab-terraform" estará criado no portal do Azure, na região "East US".