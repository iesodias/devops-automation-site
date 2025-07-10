---
id: checkov-github
title: Aula 15 - Integração do Checkov com GitHub Actions
noindex: true
---

# Integração do Checkov com GitHub Actions

## Introdução

Integrar o Checkov com o GitHub Actions é uma forma eficaz de garantir que sua infraestrutura como código seja validada automaticamente em cada push ou pull request. Com isso, você garante segurança e conformidade de forma automatizada, diretamente no seu fluxo de CI/CD.

## O que você precisa

* Um repositório no GitHub contendo código Terraform
* Um arquivo `.github/workflows/checkov.yml`

## Exemplo de workflow com Checkov

```yaml
name: Terraform Security Scan

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  checkov-scan:
    name: Checkov Scan
    runs-on: ubuntu-latest

    steps:
      - name: Checkout do repositório
        uses: actions/checkout@v3

      - name: Instalar Checkov
        uses: bridgecrewio/checkov-action@master
        with:
          directory: ./infra
          quiet: true
          soft_fail: false
          output_format: cli
```

## Explicação das opções

* `directory`: caminho do diretório Terraform
* `quiet`: suprime logs menos relevantes
* `soft_fail`: se `true`, não falha o pipeline mesmo com erro
* `output_format`: formato do relatório (cli, json, sarif, etc.)

## Output esperado no GitHub Actions

* Checkov será executado automaticamente
* Serão listados os checks que passaram e os que falharam
* Em caso de falhas, o PR/push pode ser bloqueado (se `soft_fail: false`)

## Melhores práticas

* Rode o Checkov em todos os pull requests
* Combine com `terraform fmt` e `terraform validate` para validação completa
* Use `output_format: sarif` para integrar com GitHub Code Scanning
* Configure `soft_fail` para `true` em fase inicial e `false` em ambientes mais restritivos
* Armazene relatórios como artefatos para auditoria futura

## Conclusão

Integrar o Checkov ao GitHub Actions é uma forma simples e eficaz de implementar segurança e conformidade como parte nativa do seu ciclo de desenvolvimento. Automatizar essas checagens reduz riscos e aumenta a confiança nas entregas de infraestrutura.
