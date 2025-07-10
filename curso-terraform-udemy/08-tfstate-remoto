---
id: backend-remote
title: Aula 7 - O Perigo do terraform.tfstate e a Solução do Backend Remoto
noindex: true
---

# Aula 7: O tfstate e Backend Remoto no Azure

---

## Introdução

Nesta aula, vamos abordar o arquivo mais crítico do Terraform: o `terraform.tfstate`. Ele é vital para o funcionamento da ferramenta, mas também é um dos maiores riscos de segurança quando mal gerenciado. Vamos entender o perigo do estado local e como o backend remoto no Azure resolve todos esses problemas.

---

## O que é o terraform.tfstate?

O `terraform.tfstate` é um arquivo JSON que guarda:

* O mapeamento entre seu código e os recursos reais criados no Azure
* Metadados sobre dependências
* Atributos dos recursos, incluindo dados sensíveis (como senhas!)

### Exemplo de risco:

```json
"resources": [
  {
    "type": "azurerm_sql_server",
    "name": "meu_servidor_sql",
    "instances": [
      {
        "attributes": {
          "administrator_login_password": "MinhaSenhaSuperSecreta123",
          "fully_qualified_domain_name": "meuservidor.database.windows.net"
        }
      }
    ]
  }
]
```

---

## Problemas do Estado Local

1. **Segurança**: Pode conter segredos
2. **Colaboração**: Trabalhos simultâneos geram conflitos
3. **Perda de Dados**: Um simples rm -rf pode destruir tudo

---

## A Solução: Backend Remoto no Azure

Armazenar o estado em um local seguro e compartilhado, como o **Azure Blob Storage**, traz os seguintes benefícios:

* **Segurança** com criptografia e RBAC do Azure
* **Colaboração** com estado centralizado
* **Locking** automático com leasing nativo do Blob

---

## Conceitos Importantes

* **Storage Account**: Contêiner geral de serviços de armazenamento
* **Blob Storage**: Onde o arquivo de estado é realmente salvo
* **Container**: Diretório dentro do Blob Storage
* **Key**: Caminho/nome do arquivo tfstate

---

## Exemplo prático - backend.tf

```hcl
terraform {
  backend "azurerm" {
    resource_group_name  = "rg-terraform-state-prod"
    storage_account_name = "tfstateprodproject"
    container_name       = "tfstate"
    key                  = "meu-projeto/terraform.tfstate"
  }
}
```

---

## Inicialização do backend

```bash
az login
az group create -n rg-terraform-state-prod -l eastus
az storage account create -n tfstateprodproject -g rg-terraform-state-prod --sku Standard_LRS
az storage container create --name tfstate --account-name tfstateprodproject
terraform init
```

### Output esperado:

```text
Initializing the backend...
Successfully configured the backend "azurerm"!
Terraform will use the remote backend from now on.
```

---

## terraform plan com locking

```bash
terraform plan
```

```text
Acquiring state lock. This may take a few moments...
...
Plan: 1 to add, 0 to change, 0 to destroy.
```

---

## Melhores Práticas

* Nunca adicione o tfstate ao Git!
* Sempre use backend remoto em times
* Ative o RBAC na Storage Account
* Proteja o acesso ao blob com políticas de acesso restritas
* Use criptografia e monitoramento

---