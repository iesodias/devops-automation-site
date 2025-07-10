---
id: checkov-comandos
title: Aula 14 - Checkov no Terraform - Comandos e Exemplos
noindex: true
---

# Checkov no Terraform: Comandos e Exemplos Atualizados

## Introdução

Após entender o que é o Checkov e sua importância para conformidade e segurança em projetos Terraform, vamos agora focar na parte prática: **como usar o Checkov na linha de comando** com exemplos reais de aplicação.

Esta página traz uma série de comandos atualizados segundo a documentação oficial do Checkov, com simulações de uso em ambientes Azure.

## Explicação técnica

* Checkov pode ser usado para escanear arquivos `.tf`, diretórios ou planos de execução.
* Permite definir checks por ID, severidade ou frameworks.
* Suporta integração com tfvars, custom checks e geração de baseline.

## Comandos principais

```bash
# Escanear um diretório com arquivos Terraform
checkov -d ./infra

# Escanear um arquivo específico
checkov -f ./infra/main.tf

# Listar todos os checks disponíveis
checkov --list

# Usar arquivo de variáveis tfvars
checkov -d ./infra --var-file dev.tfvars

# Especificar checks por ID ou severidade
checkov -d ./infra --check MEDIUM,HIGH --skip-check CKV_AZURE_21

# Formatar saída em JSON e salvar em arquivo
checkov -d ./infra -o json --output-file-path resultados.json

# Rodar com soft-fail (não falha mesmo com erro)
checkov -d ./infra --soft-fail

# Criar baseline para ignorar achados repetidos
checkov -d ./infra --create-baseline

# Usar baseline previamente salvo
checkov -d ./infra --baseline .checkov.baseline
```

## Exemplo prático

### Arquivo `main.tf`

```hcl
resource "azurerm_storage_account" "exemplo" {
  name                      = "storagemodule"
  location                  = "eastus"
  resource_group_name       = "meu-rg"
  account_tier              = "Standard"
  account_replication_type  = "LRS"
  allow_blob_public_access  = true
}
```

### Resultado esperado com `checkov -f main.tf`

```bash
Checkov v3.X.X

main.tf (terraform)
====================

❌ CKV_AZURE_21: "Storage account should not allow public blob access"
	FAILED for resource azurerm_storage_account.exemplo
	File: main.tf:1-8
	Guide: https://docs.bridgecrew.io/docs/azure_21-public-access-on-storage

Passed checks: 5, Failed checks: 1
```

## Melhores práticas

* Use `--baseline` para evitar alertas repetidos em builds
* Combine `--check` e `--skip-check` para foco em riscos reais
* Rode o Checkov em todo commit (pre-commit ou CI/CD)
* Habilite logs detalhados com `LOG_LEVEL=debug`
* Para Azure, priorize checks sobre criptografia, identidade e exposição
* Documente exceções usando o `.checkov.baseline` com justificativas claras

## Conclusão

Com os comandos certos, o Checkov se torna uma ferramenta poderosa e simples para garantir a qualidade e conformidade da sua infraestrutura como código. Aproveite os exemplos acima para aplicar em seu projeto e incorporar no seu fluxo de trabalho.
