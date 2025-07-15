---
id: 20-intro-kevault
title: Lab 20 - Introdução ao Azure Key Vault
noindex: true
---

# Criando uma Máquina Virtual no Azure com senha armazenada no Key Vault usando Terraform

## Introdução

Ao trabalhar com infraestrutura como código, é essencial adotar boas práticas de segurança desde o início. Um erro comum é definir senhas diretamente no código, o que pode expor informações sensíveis. Neste laboratório, vamos aprender como provisionar uma **máquina virtual Linux no Azure** usando o Terraform, com a senha de administrador armazenada de forma segura no **Azure Key Vault**.

## O que é

Esse lab demonstra como usar o **Azure Key Vault** em conjunto com o Terraform para proteger credenciais. Em vez de definir uma senha em texto plano no código, o segredo será armazenado no Key Vault, e o Terraform irá consultá-lo dinamicamente durante o provisionamento da VM.

## Explicação técnica

* O **Key Vault** é criado previamente e contém um segredo com a senha do administrador.
* O Terraform irá utilizar um **data source** para buscar esse segredo.
* A senha é passada para o recurso `azurerm_linux_virtual_machine` como parâmetro.
* A infraestrutura será composta por:

  * Resource Group
  * Network
  * Network Interface
  * Virtual Machine
  * Key Vault com segredo

## Comandos principais

```bash
terraform init
terraform plan -out tfplan
terraform apply tfplan
```

## Estrutura de arquivos

### `main.tf`

Contém os recursos principais: VM, rede e acesso ao segredo no Key Vault.

### `variables.tf`

Define variáveis como nomes, localização, tamanho da VM e nome do segredo.

### `outputs.tf`

Retorna informações úteis como IP público da VM.

### `terraform.tfvars`

Fornece valores reais para as variáveis.

## Exemplo de arquivos

### `variables.tf`

```hcl
variable "location" {
  type    = string
  default = "eastus"
}

variable "resource_group_name" {
  type = string
}

variable "vm_admin_username" {
  type = string
}

variable "key_vault_name" {
  type = string
}

variable "secret_name" {
  type = string
}
```

### `terraform.tfvars`

```hcl
resource_group_name = "rg-tf-vm-keyvault"
vm_admin_username   = "azureuser"
key_vault_name      = "kv-tf-lab"
secret_name         = "vmPassword"
```

### `outputs.tf`

```hcl
output "public_ip" {
  value = azurerm_public_ip.vm_ip.ip_address
}
```

## Output esperado (simulado)

```txt
Apply complete! Resources: 6 added, 0 changed, 0 destroyed.

Outputs:

public_ip = "52.170.12.34"
```

## Boas práticas

* **Nunca armazene segredos no código-fonte.**
* Use `terraform.tfvars` para valores variáveis, e `terraform.tfvars.example` para compartilhar com a equipe.
* Defina o Key Vault e o segredo fora da automação principal, como parte do provisionamento inicial do ambiente.
* Use Managed Identity e RBAC para acessar o Key Vault no futuro (mais avançado).
* Faça o versionamento dos seus arquivos Terraform e use `terraform plan` sempre antes de aplicar.

---

Esse cenário reforça a importância da segurança desde o início. Na próxima aula, vamos explorar como aplicar esse padrão em ambientes mais complexos com múltiplos serviços integrados.
