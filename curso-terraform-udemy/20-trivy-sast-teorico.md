---
id: trivy-teorico-1
title: Aula 12 - Usando o Trivy com Terraform
noindex: true
---
# Usando o Trivy com Terraform

## Introdução

Manter sua infraestrutura como código segura significa validar não apenas vulnerabilidades, mas também **más configurações (misconfigurations)**. O Trivy oferece uma solução prática para isso, valorizando a qualidade do seu código antes de aplicá-lo em produção.

## O que é o Trivy para Terraform

O Trivy é uma ferramenta de segurança que vai além de imagens Docker e aplicações — ele também permite escanear arquivos de configuração do Terraform com o comando `trivy config`, avaliando se seu código segue boas práticas recomendadas.

## Explicação técnica

* Usa políticas internas (ou personalizadas com Rego) para avaliar configurações Terraform
* Compara com padrões de segurança de Azure, AWS, GCP, etc.
* Suporta arquivos `.tf`, `.tf.json`, planos (`tfplan.json`) e `tfvars`
* Retorna relatórios de falhas identificadas por severidade (LOW a CRITICAL)

## Comandos

```bash
# Escanear todo o diretório Terraform
trivy config ./infra

# Usar arquivo tfvars
trivy config --tf-vars="dev.tfvars" ./infra

# Definir formato de saída e salvar
trivy config -f json -o tfscan.json ./infra

# Escanear plano Terraform
terraform plan -out tfplan.binary
terraform show -json tfplan.binary > tfplan.json
trivy config ./tfplan.json
```

## Exemplo prático

Diretório `infra/` com `main.tf`, `variables.tf` e `dev.tfvars`

```bash
$ trivy config --tf-vars=dev.tfvars ./infra
INFO  Detected config files: 3
main.tf (terraform configuration)
=================================
Tests: 10 (SUCCESS: 8, FAILURE: 2)
Failures: 2 (LOW:1, MEDIUM:1)

MEDIUM: Storage account should have secure transfer enabled (Azure)
main.tf:45

LOW: Use managed identity instead of client secret (Azure)
main.tf:22
```

## Output esperado

* Lista de arquivos escaneados
* Total de testes e falhas
* Severidade, tipo e localização das falhas

## Melhores práticas

* Integre com pipelines CI/CD para impedir aplicação de código inseguro
* Sempre use `--tf-vars` nos testes por ambiente
* Ajuste severidades com `--severity`
* Crie políticas personalizadas em Rego se necessário
* Analise falhas com criticidade: nem tudo exige correção imediata

O Trivy ajuda a antecipar problemas de configuração antes que virem riscos em produção, tornando seu pipeline de IaC mais robusto e seguro.
