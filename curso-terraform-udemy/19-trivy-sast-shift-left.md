---
id: trivy-teorico
title: Aula 11 - Introdução ao Shift Left Security e SAST com Terraform
noindex: true
---

# Introdução ao Shift Left Security e SAST com Terraform

## Introdução

No desenvolvimento moderno, especialmente com infraestrutura como código (IaC), a segurança não pode ser tratada apenas no final do processo. Surge então o conceito de **Shift Left Security**, que propõe mover as validações de segurança para o início do ciclo de desenvolvimento.

Junto a essa abordagem, entra o uso de **SAST** (Static Application Security Testing), uma técnica que analisa o código estaticamente, buscando falhas e vulnerabilidades antes mesmo da execução.

## O que é Shift Left Security e SAST

* **Shift Left Security**: Estratégia que antecipa as checagens de segurança para as fases iniciais da entrega.
* **SAST**: Tipo de análise de código que examina arquivos fonte (éstáticos) em busca de vulnerabilidades ou configurações inseguras.

Aplicado ao Terraform, isso significa escanear arquivos `.tf` automaticamente em pipelines ou durante o desenvolvimento para garantir que a infraestrutura esteja segura antes do `terraform apply`.

## Explicação técnica

* A análise SAST não requer execução de infraestrutura.
* Ferramentas como **Trivy** (que substitui `tfsec`) realizam SAST em IaC com regras baseadas em benchmarks de segurança.
* Avalia más práticas como: falta de criptografia, uso de senhas em texto plano, portas abertas, configurações públicas sem controle, etc.
* Pode ser integrada em CI/CD e IDEs para feedback imediato.

## Comando básico com Trivy (SAST para Terraform)

```bash
# Escanear configuração Terraform (Azure como exemplo)
trivy config ./infra --severity HIGH,CRITICAL
```

## Exemplo prático

### Diretório `infra/` com `main.tf` contendo:

```hcl
resource "azurerm_storage_account" "exemplo" {
  name                     = "storagedev"
  resource_group_name      = "meu-rg"
  location                 = "eastus"
  account_tier             = "Standard"
  account_replication_type = "LRS"
  enable_https_traffic_only = false
}
```

### Resultado do SAST com Trivy:

```bash
main.tf:8
CRITICAL: HTTPS should be enforced for storage accounts [AZU014]
```

Esse tipo de erro pode ser corrigido ajustando a linha:

```hcl
enable_https_traffic_only = true
```

## Output esperado

* Nome do arquivo analisado
* Linha do problema
* Severidade (LOW, MEDIUM, HIGH, CRITICAL)
* Código da regra e descrição da falha

## Melhores práticas

* Sempre inclua uma etapa de `trivy config` no CI/CD
* Use SAST desde o ambiente de desenvolvimento (ex: pre-commit, extensões de editor)
* Priorize correções por severidade
* Documente falhas conhecidas com justificativas se não puderem ser corrigidas imediatamente
* Combine com validação de sintaxe (`terraform validate`) e linting

## Conclusão

Aplicar SAST em Terraform com ferramentas como Trivy é essencial para garantir que sua infraestrutura seja segura desde o início. O Shift Left Security promove agilidade sem abrir mão da segurança, reduzindo custos e prevenindo riscos antes mesmo do deploy.
