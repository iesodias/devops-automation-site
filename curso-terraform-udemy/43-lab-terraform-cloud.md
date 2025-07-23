---
id: 25-lab-sentinel-tfc
title: Lab 25 - Criando um Resource Group no Azure com Terraform Cloud (Execução Local)
noindex: true
---

# Lab: Criando um Resource Group no Azure com Terraform Cloud (Execução Local)

## Objetivo

Demonstrar como criar um **Resource Group no Azure** utilizando o **Terraform Cloud como backend remoto**, executando os comandos localmente na máquina do desenvolvedor.

---

## Requisitos

* Conta no [Terraform Cloud](https://app.terraform.io/)
* Azure CLI instalado e logado (`az login`)
* Token de acesso ao Azure (Service Principal)
* Token de acesso ao Terraform Cloud configurado localmente

### Criar Service Principal e obter credenciais (passo essencial)

Execute o comando abaixo substituindo `<sub_id>` pelo ID da sua assinatura Azure:

```bash
az ad sp create-for-rbac --name "terraform-tfc" \
  --role="Contributor" \
  --scopes="/subscriptions/<sub_id>" \
  --sdk-auth
```

Copie os valores do JSON retornado e use para configurar as variáveis de ambiente no Terraform Cloud.

---

## Etapas do Lab

### 1. Criar diretório do projeto

```bash
mkdir tfc-rg-lab && cd tfc-rg-lab
```

### 2. Criar arquivos base

```bash
touch main.tf variables.tf terraform.tfvars outputs.tf
```

### 3. Arquivo `main.tf`

```hcl
terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }

  cloud {
    organization = "sua-organizacao"

    workspaces {
      name = "rg-azure-lab"
    }
  }
}

provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
}
```

### 4. Arquivo `variables.tf`

```hcl
variable "resource_group_name" {
  type = string
}

variable "location" {
  type = string
}
```

### 5. Arquivo `terraform.tfvars`

```hcl
resource_group_name = "rg-from-tfc"
location            = "eastus"
```

### 6. Arquivo `outputs.tf`

```hcl
output "rg_name" {
  value = azurerm_resource_group.rg.name
}
```

---

## 7. Criar Workspace no Terraform Cloud

1. Acesse [Terraform Cloud](https://app.terraform.io/)
2. Crie uma nova organização ou use uma existente
3. Crie um novo **Workspace CLI-Driven** com o nome `rg-azure-lab`
4. Na aba **Variables**, adicione as seguintes variáveis de ambiente:

### Variáveis de Ambiente (Environment Variables)

```txt
ARM_CLIENT_ID        = xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
ARM_CLIENT_SECRET    = xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
ARM_SUBSCRIPTION_ID  = xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
ARM_TENANT_ID        = xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

> Essas credenciais são obtidas no passo anterior com `az ad sp create-for-rbac`

---

## 8. Configurar autenticação do Terraform Cloud localmente

Crie o arquivo `~/.terraformrc` (Linux/macOS) ou `%APPDATA%\terraform.rc` (Windows):

```hcl
credentials "app.terraform.io" {
  token = "seu-token-do-terraform-cloud"
}
```

---

## 9. Executar os comandos Terraform localmente

```bash
terraform init
terraform plan -out=tfplan
terraform apply tfplan
```

---

## Output esperado (no terminal local)

```txt
Apply complete! Resources: 1 added, 0 changed, 0 destroyed.

Outputs:
rg_name = "rg-from-tfc"
```

---

## 10. (Opcional) Criar Policy Sentinel de Teste

Para testar o Sentinel com Terraform Cloud, crie a seguinte policy simples:

### Policy: `restrict-region.sentinel`

```hcl
# Importa o mock do plano do Terraform para análise
import "tfplan/v2" as tfplan

# Define a região permitida como uma variável local
allowed_location = "eastus"

# Encontra todos os Azure Resource Groups que estão sendo criados ou atualizados no plano
all_resource_groups = filter tfplan.resource_changes as _, rc {
	rc.type is "azurerm_resource_group" and
		(rc.change.actions contains "create" or rc.change.actions contains "update")
}

# Regra de validação: Verifica se a localização de cada Resource Group é a permitida
location_is_valid = rule {
	all all_resource_groups as _, rg {
		rg.change.after.location is allowed_location
	}
}

# Regra principal (main) - O resultado desta regra determina o sucesso ou falha da policy
main = rule {
	location_is_valid
}

```

### Passos para aplicar:

1. No Terraform Cloud, vá até a organização → **Policies**
2. Clique em **Create Policy**, cole o código acima
3. Publique a policy
4. Vá em **Policy Sets** e associe ao workspace `rg-azure-lab`
5. Use enforcement `advisory` para testes

---

## Considerações finais

* Utilize `terraform.tfvars` para valores por ambiente
* O estado será armazenado no Terraform Cloud de forma segura
* Sempre adicione variáveis sensíveis como secret na interface do Terraform Cloud
* O `az login` é útil localmente, mas **não é usado pelo Terraform Cloud**, mesmo com execução CLI
* Use Workspaces CLI-driven para essa abordagem híbrida
* O Sentinel permite implementar validações e políticas de segurança no fluxo de CI/CD

Esse lab demonstra como usar o Terraform Cloud como backend, mantendo a execução local. Excelente para práticas seguras, políticas organizacionais e preparação para ambientes colaborativos e certificações.
