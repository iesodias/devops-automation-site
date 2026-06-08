---
slug: criar-agente-terraform-vscode
title: "Como Criar um Agente de Terraform no VS Code para Provisionar Infraestrutura"
description: "Veja como criar um agente do VS Code focado em Terraform para provisionar infraestrutura com mais padrão, velocidade e menos erro manual."
authors: [Ieso]
tags:
  - "terraform"
  - "vscode"
  - "automacao devops"
  - "ia devops"
keywords: [agentes vscode, terraform, infraestrutura como código, provisionamento, automação, devops, ia, copilot]
date: 2026-05-18
---

# Como Criar um Agente de Terraform no VS Code para Provisionar Infraestrutura

<!-- truncate -->

## Introdução

Se você já usa o VS Code com agentes do Copilot, vale transformar essa capacidade em um fluxo prático para Terraform. A ideia é simples: criar um agente especializado para provisionar infraestrutura com padrões claros, menos ruído e mais consistência.

Em vez de pedir tarefas genéricas para a IA, você define um agente com foco em Terraform, com instruções objetivas sobre estilo, validação e entrega. O resultado é um assistente que responde melhor para casos como criar módulos, montar ambientes, revisar variáveis e sugerir boas práticas de IaC.

## O que este agente deve resolver

O agente de Terraform deve ajudar em tarefas repetitivas e críticas do dia a dia:

- criar arquivos `.tf` com estrutura consistente
- sugerir variáveis, outputs e `locals`
- montar módulos reutilizáveis
- revisar código para reduzir erro de sintaxe e de padrão
- orientar o uso de `terraform fmt`, `validate` e `plan`
- manter a configuração alinhada ao padrão do time

O ponto principal é evitar um agente genérico demais. Quanto mais claro for o papel dele, melhor será a resposta.

## Pré-requisitos

Antes de montar o agente, tenha estes itens definidos:

- VS Code com suporte ao Copilot Agent Mode
- uma pasta de projeto com Terraform já iniciada
- padrão de organização para módulos, ambientes e backend
- uma ideia clara do que o agente pode e não pode fazer

Se o objetivo é provisionar infraestrutura de forma segura, o agente não deve inventar recursos. Ele precisa seguir o padrão do repositório e pedir confirmação quando houver risco.

## Estrutura do agente no VS Code

No VS Code, os agentes personalizados podem ser definidos em arquivos Markdown com front matter YAML. O padrão mais prático é colocá-los em `.github/agents/`.

Exemplo de estrutura:

```text
.github/
  agents/
    terraform.agent.md
```

O arquivo define nome, descrição, ferramentas permitidas e o comportamento esperado do agente.

## Prompt base do agente de Terraform

Um bom agente de Terraform precisa de instruções curtas, diretas e verificáveis. Exemplo:

```markdown
---
name: terraform-provisioner
description: "Cria e revisa infraestrutura em Terraform seguindo o padrão do repositório"
tools: [search, edit, terminal]
user-invocable: true
model: "GPT-5.2"
---

Você é um especialista em Terraform.

## Objetivo
- Criar infraestrutura como código com padrão consistente.
- Propor mudanças pequenas e seguras.
- Validar o código antes de sugerir conclusão.

## Regras
- Não alterar arquivos fora do escopo pedido.
- Não criar recursos sem explicitar o impacto.
- Sempre preferir módulos reutilizáveis quando existirem.
- Sempre considerar `terraform fmt`, `validate` e `plan`.

## Resposta esperada
- Resumo curto do que foi feito.
- Arquivos alterados.
- Próximo comando recomendado.
```

Esse formato funciona bem porque deixa claro o papel do agente, limita ferramentas e força uma resposta útil.

## Fluxo de trabalho para provisionar infraestrutura

O fluxo ideal com esse agente é este:

1. Você descreve o objetivo, como “criar VPC, subnets e security groups”.
2. O agente analisa a base existente e identifica módulos reutilizáveis.
3. Ele propõe a mudança mínima necessária.
4. Você revisa o código antes de aplicar.
5. O agente orienta a execução de `terraform fmt`, `terraform validate` e `terraform plan`.

Esse ciclo reduz retrabalho e ajuda a evitar mudanças grandes demais em uma única interação.

## Boas práticas para evitar erro em infraestrutura

Para o agente ser realmente útil, siga estas boas práticas:

- mantenha instruções curtas e objetivas
- diga explicitamente quais providers e padrões usar
- limite o agente ao diretório certo do projeto
- peça saídas pequenas, com diffs fáceis de revisar
- inclua sempre validação de sintaxe e plano antes de provisionar

Também vale separar bem o que é automação assistida do que é aplicação real em produção. O agente pode acelerar a criação, mas a decisão final continua sendo sua.

## Quando usar esse agente e quando não usar

Use esse agente quando a tarefa envolver criação, revisão ou padronização de Terraform. Não use quando a mudança depender de decisão arquitetural ampla, impacto financeiro relevante ou aprovação de segurança.

Em termos práticos, ele é ótimo para acelerar o trabalho, mas não substitui revisão técnica.

## Conclusão

Criar um agente de Terraform no VS Code é uma forma objetiva de transformar IA em produtividade real. Em vez de conversar com um assistente genérico, você passa a ter um agente focado em infraestrutura como código, com regras claras, escopo definido e saída mais confiável.

Se o seu time trabalha com Terraform com frequência, esse tipo de agente ajuda a padronizar entregas, reduzir erro manual e acelerar tarefas repetitivas sem perder controle do processo.
