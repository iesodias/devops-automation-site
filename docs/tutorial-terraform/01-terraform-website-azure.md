---
sidebar_position: 1
title: "Como Criar um Site Estático na Azure Usando Terraform (Passo a Passo 2025)"
description: "Aprenda a criar um site estático na Azure usando Terraform, configurando Storage Account, Resource Group e publicação automática de HTML. Tutorial completo para DevOps e Cloud!"  
keywords:
  - "terraform azure site estatico"
  - "terraform criar site estatico"
  - "azure storage site estatico"
  - "terraform azure tutorial"
  - "site estatico azure storage"
  - "infraestrutura como codigo terraform"
  - "tutorial terraform azure pt-br"
---

# Passo a Passo Completo para Criar Site Estático na Azure com Terraform

<div align="center">

## Assista no YouTube o passo a passo!

<iframe width="560" height="315" src="https://www.youtube.com/embed/5P-SKj7v9Ho" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

</div>



## 1. Pré-requisitos
- Ter uma conta Azure ativa.
- Instalar o [Terraform](https://developer.hashicorp.com/terraform/downloads) na sua máquina.
- Instalar o [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli) para autenticação.

---

## 2. Crie a Estrutura de Arquivos

No seu terminal:

```bash
mkdir terraform-azure-static-site
cd terraform-azure-static-site
touch main.tf
```

---

## 3. Conteúdo do Arquivo `main.tf`

```hcl
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = "terraform-demo-rg"
  location = "Brazil South"
}

resource "azurerm_storage_account" "storage" {
  name                     = lower(replace("sttf${substr(sha256(azurerm_resource_group.rg.name), 0, 8)}", "/[^a-z0-9]/", ""))
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  static_website {
    index_document = "index.html"
  }
}

resource "azurerm_storage_blob" "index" {
  name                   = "index.html"
  storage_account_name   = azurerm_storage_account.storage.name
  storage_container_name = "$web"
  type                   = "Block"
  content_type           = "text/html"
  source_content         = <<-EOT
    <!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <title>Site DevOps Automation</title>
    <style>
      body { font-family: Arial, sans-serif; text-align: center; margin: 0; padding: 20px; background-color: #f5f5f5; }
      .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
      img { max-width: 300px; margin-bottom: 20px; }
      h1 { color: #2e86c1; }
    </style>
    </head>
    <body>
    <div class="container">
      <img src="https://devopsautomation.com.br/img/devops-logo.png" alt="DevOps Automation Logo">
      <h1>✅ Infraestrutura como Código</h1>
      <p>Este site foi deployado automaticamente usando Terraform na Azure</p>
      <p>Acesse <a href="https://devopsautomation.com.br">devopsautomation.com.br</a> para mais conteúdos</p>
    </div>
    </body>
    </html>
  EOT
}

output "website_url" {
  value = azurerm_storage_account.storage.primary_web_endpoint
}
```

---

## 4. Inicializar o Terraform

No terminal, dentro da pasta do projeto:

```bash
terraform init
```

---

## 5. Validar a Configuração

```bash
terraform validate
```

---

## 6. Visualizar o que será criado

```bash
terraform plan
```

---

## 7. Aplicar a Infraestrutura

```bash
terraform apply
```

Confirme digitando `yes`.

---

## 8. Acessar seu Site

Após a execução, o Terraform vai te mostrar a URL do site no output `website_url`. Basta copiar e colar no navegador para acessar seu site estático!

---

# 🚀 Pronto! Seu site está no ar, automatizado com Terraform!