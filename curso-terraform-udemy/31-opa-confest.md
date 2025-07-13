---
id: 13-opa-confest
title: Lab 13 - Usando OPA com Conftest no Terraform
noindex: true
---
# Usando OPA com Conftest no Terraform

## Introdução

Além de usar o OPA diretamente com o comando `opa eval`, é comum utilizar a ferramenta **Conftest**, que facilita a aplicação de políticas OPA em arquivos de configuração como os gerados pelo Terraform. Neste documento, vamos aprender como usar Conftest com arquivos Terraform e como integrar isso ao fluxo de trabalho.

## O que é o Conftest

O **Conftest** é uma ferramenta de linha de comando que usa o OPA para validar arquivos de configuração contra políticas definidas em Rego. Ele abstrai parte da complexidade do OPA e é ideal para quem quer aplicar regras de forma simples e eficiente.

## Explicação técnica

* O Conftest interpreta arquivos JSON ou HCL convertidos em JSON
* As políticas ficam em arquivos `.rego`, dentro da pasta `policy/`
* Retorna erro se alguma regra `deny` for acionada
* Pode ser usado localmente ou em pipelines

## Instalação

```bash
brew install conftest   # macOS
choco install conftest  # Windows
scoop install conftest  # Alternativa Windows
```

## Estrutura de arquivos

```
infra/
  main.tf
  plan.json
policy/
  deny_public_ip.rego
```

## Exemplo de política: `policy/deny_public_ip.rego`

```rego
package main

deny[msg] {
  input.resource_changes[_].change.after.associate_public_ip_address == true
  msg = "Não é permitido associar IP público a instâncias."
}
```

## Gerar plan.json a partir do Terraform

```bash
terraform init
terraform plan -out=tfplan.binary
terraform show -json tfplan.binary > plan.json
```

## Rodar o Conftest no plan.json

```bash
conftest test plan.json --policy policy/
```

## Output esperado

```bash
FAIL - plan.json - Não é permitido associar IP público a instâncias.

1 test, 0 passed, 1 failed, 0 warnings
```

## Outros comandos úteis

```bash
# Rodar com formato TAP (bom para CI)
conftest test plan.json --policy policy/ --output tap

# Rodar em todos arquivos .json
conftest test . --policy policy/ --all-namespaces
```

## Melhores práticas

* Mantenha as políticas versionadas no mesmo repositório do Terraform
* Use nomes descritivos nos arquivos `.rego`
* Escreva mensagens claras em `deny[msg]` para orientar o time
* Rode localmente e no CI/CD para cobertura total
* Combine com `terraform fmt`, `validate`, e Checkov para uma esteira completa de validação

## Conclusão

O uso de Conftest com OPA no Terraform torna a aplicação de regras e políticas algo simples, automatizado e confiável. Ao aplicar validações personalizadas diretamente sobre o plano de execução, você previne erros de segurança e garante conformidade desde o início do desenvolvimento.
