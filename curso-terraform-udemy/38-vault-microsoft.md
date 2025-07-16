---
id: 20-intro-kevault
title: Lab 20 - Introdução ao Azure Key Vault
noindex: true
---

# Introdução ao Azure Key Vault

## Introdução

Em ambientes de nuvem, proteger informações sensíveis como senhas, chaves de API, certificados e strings de conexão é uma prioridade. O **Azure Key Vault** é um serviço criado especificamente para atender essa necessidade. Nesta página, vamos entender o que é o Key Vault, cenários comuns de uso, como ele funciona tecnicamente e como manipulá-lo via Azure CLI.

## O que é

O **Azure Key Vault** é um serviço de gerenciamento de segredos, chaves e certificados na nuvem da Microsoft. Ele permite armazenar informações sensíveis de forma segura, com controle de acesso, auditoria e integração nativa com outros serviços do Azure.

Com ele, você pode:

* Armazenar **segredos** como senhas, tokens e connection strings
* Gerenciar **chaves criptográficas** usadas por aplicações e serviços
* Controlar **certificados** públicos e privados
* Integrar com serviços como Azure Functions, App Service, AKS, Terraform, entre outros

## Explicação técnica

O Key Vault funciona como um cofre isolado por região e escopo. Ele possui os seguintes componentes:

* **Vault:** A instância do Key Vault em si
* **Secrets:** Pares chave-valor para armazenar informações sensíveis
* **Keys:** Chaves criptográficas gerenciadas pelo Azure ou importadas
* **Certificates:** Certificados SSL/TLS gerenciados com ciclo de vida automatizado

O controle de acesso pode ser feito de duas formas:

* **Política de acesso (Access Policy):** ACL tradicional dentro do Vault
* **Azure RBAC:** Modelo baseado em funções do Azure, mais integrado e moderno

Além disso, o Key Vault pode ser acessado por serviços com identidades gerenciadas (Managed Identity), evitando o uso de credenciais fixas.

## Comandos usando Azure CLI

### Criar um Resource Group

```bash
az group create --name rg-keyvault-lab --location eastus
```

### Criar o Key Vault

```bash
az keyvault create \
  --name kv-meulab \
  --resource-group rg-keyvault-lab \
  --location eastus
```

### Inserir um segredo

```bash
az keyvault secret set \
  --vault-name kv-meulab \
  --name "MeuSegredo" \
  --value "ValorSuperSecreto"
```

### Listar segredos

```bash
az keyvault secret list --vault-name kv-meulab
```

### Obter o valor de um segredo

```bash
az keyvault secret show \
  --vault-name kv-meulab \
  --name "MeuSegredo" \
  --query value -o tsv
```

## Cenários comuns de uso

* **Aplicações Web:** Armazenar strings de conexão e tokens de API
* **Terraform e DevOps:** Manter segredos fora do código e consumir dinamicamente
* **Ciclo de vida de certificados:** Automatizar a renovação e distribuição
* **Serviços com Managed Identity:** App Services e Azure Functions acessam segredos sem expor credenciais
* **Ambientes multiusuário:** RBAC permite controle detalhado sobre quem pode ver ou modificar os segredos

---

O Key Vault é uma ferramenta essencial em qualquer estratégia de segurança em nuvem. Seu uso reduz riscos, aumenta a rastreabilidade e prepara sua aplicação para práticas profissionais de DevSecOps. Nos próximos módulos, veremos como integrá-lo com Terraform e pipelines de CI/CD.
