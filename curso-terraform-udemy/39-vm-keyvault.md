---
id: 21-criar-vm-kevault
title: Lab 21 - Criando uma Máquina Virtual no Azure com senha armazenada no Key Vault usando Terraform
noindex: true
---

# Criando uma Máquina Virtual no Azure com senha armazenada no Key Vault usando Terraform

## Introdução

Ao trabalhar com infraestrutura como código, é essencial adotar boas práticas de segurança desde o início. Um erro comum é definir senhas diretamente no código, o que pode expor informações sensíveis. Neste laboratório, vamos aprender como provisionar uma **máquina virtual Linux no Azure** usando o Terraform, com a senha de administrador armazenada de forma segura no **Azure Key Vault**.

## O que é

Esse lab demonstra como usar o **Azure Key Vault** em conjunto com o Terraform para proteger credenciais. Em vez de definir uma senha em texto plano no código, o segredo será armazenado no Key Vault, e o Terraform irá consultá-lo dinamicamente durante o provisionamento da VM.

## Explicação técnica

O Azure Key Vault funciona como um cofre de segredos. Nele, armazenamos dados sensíveis como senhas, tokens e chaves criptográficas. O grande diferencial aqui é que o segredo não precisa — e **não deve** — ser inserido diretamente nos arquivos `.tf` ou `.tfvars`.

Ao utilizar os blocos `data` no Terraform, conseguimos consultar recursos que já existem fora do nosso controle direto. Ou seja, podemos acessar um segredo existente no Key Vault sem criá-lo via Terraform, mantendo o princípio de separação de responsabilidades e aumentando a segurança.

### Explicando o código passo a passo:

#### Provider

```hcl
provider "azurerm" {
  features {}
}
```

Define o provedor do Azure. O bloco `features {}` é necessário para habilitar os recursos.

#### Data do Key Vault

```hcl
data "azurerm_key_vault" "kv" {
  name                = var.key_vault_name
  resource_group_name = var.resource_group_name
}
```

Esse bloco não cria o Key Vault, apenas consulta um existente com base no nome e no resource group. Isso evita que o segredo seja recriado ou sobrescrito.

#### Data do segredo

```hcl
data "azurerm_key_vault_secret" "vm_password" {
  name         = var.secret_name
  key_vault_id = data.azurerm_key_vault.kv.id
}
```

Aqui buscamos um segredo já criado dentro do cofre. O valor retornado é tratado como sensível automaticamente, e pode ser usado diretamente como parâmetro.

#### Uso na máquina virtual

```hcl
admin_password = data.azurerm_key_vault_secret.vm_password.value
```

Esse é o ponto crítico: a senha é injetada diretamente no recurso da VM, sem estar declarada no código-fonte. O Terraform buscará o valor em tempo de execução.

> ⚠️ Importante: o segredo **deve ser criado previamente** usando o portal ou Azure CLI, pois o Terraform só irá ler o segredo — não irá criá-lo.

## Comandos principais

Antes de aplicar o Terraform, crie o Key Vault e adicione um segredo manualmente:

```bash
az group create --name rg-tf-vm-keyvault --location eastus

az keyvault create \
  --name kv-tf-lab \
  --resource-group rg-tf-vm-keyvault \
  --location eastus

az keyvault secret set \
  --vault-name kv-tf-lab \
  --name vmPassword \
  --value "SenhaSuperSegura123"
```

Depois, aplique o Terraform normalmente:

```bash
terraform init
terraform plan -out tfplan
terraform apply tfplan
```

## Estrutura de arquivos (exemplo reduzido)

### `main.tf`

Contém os blocos para consultar o Key Vault, buscar o segredo e configurar a máquina virtual.

### `variables.tf`

Define os valores esperados, como nome do vault e nome do segredo.

### `outputs.tf`

Exibe, por exemplo, o IP público da VM (sem mostrar informações sensíveis).

### `terraform.tfvars`

Contém os valores atribuídos às variáveis, exceto os segredos.

## Output esperado (simulado)

```txt
Apply complete! Resources: 6 added, 0 changed, 0 destroyed.

Outputs:

public_ip = "52.170.12.34"
```

## Boas práticas

* **Nunca armazene segredos no código-fonte.**
* Use `terraform.tfvars` apenas para dados não sensíveis.
* Crie e gerencie os segredos no Key Vault como uma etapa manual ou automatizada à parte.
* Evite colocar o `terraform.tfstate` em repositórios sem criptografia.
* Marque outputs sensíveis com `sensitive = true`, quando necessário.
* Evite que a senha apareça nos logs ou outputs durante o `apply`.
* Prefira identidade gerenciada (Managed Identity) para dar acesso ao Key Vault, em vez de usar `client_id` e `client_secret` no provider.

---

Esse cenário reforça a importância da segurança desde o início. Com o Key Vault integrado ao Terraform, conseguimos separar o código da infraestrutura dos dados sensíveis, promovendo um ambiente mais seguro, auditável e escalável.
