---
id: github-token
title: Github Token
---

# Permissões e GITHUB_TOKEN: Menor Privilégio

## Introdução

O GITHUB_TOKEN é criado automaticamente em cada execução do GitHub Actions e herda um conjunto de permissões. Definir essas permissões com o princípio do menor privilégio reduz riscos, evita escritas indevidas em PRs e atende a requisitos de segurança de organizações.

## Definição

O GITHUB_TOKEN é uma credencial efêmera que o GitHub injeta automaticamente durante a execução do workflow. Ele autentica chamadas à API do GitHub sem que você precise expor um token pessoal (PAT).

O bloco permissions no YAML limita o que o GITHUB_TOKEN pode ler ou gravar. Ele pode ser declarado no topo do workflow para definir um padrão para todos os trabalhos e também sobrescrito em um trabalho específico quando você precisar elevar ou reduzir o escopo apenas naquele trecho.

Referências oficiais:
- permissions (workflow syntax): https://docs.github.com/pt/actions/using-workflows/workflow-syntax-for-github-actions#permissions
- Autenticação automática (GITHUB_TOKEN): https://docs.github.com/pt/actions/security-guides/automatic-token-authentication

## Explicação Técnica

Você pode definir permissions no topo do workflow para estabelecer um padrão de acesso mínimo e, quando necessário, sobrescrever no nível do trabalho para afinar o escopo. Um padrão comum é começar com `contents: read` e elevar apenas o que for preciso por trabalho. Esse desenho ajuda a isolar tarefas que precisam escrever (por exemplo, comentar em um PR) daquelas que apenas constroem ou testam.

As permissões mais usadas incluem `contents` (acesso ao repositório para leitura e, se configurado, escrita como criação de tags e releases), `pull-requests` (habilita comentar ou atualizar PRs), `checks` e `statuses` (publicam resultados e status de checagens), `deployments` (criação e atualização de deployments), `pages` (publicação no GitHub Pages) e `id-token` (emissão de token OIDC para autenticação federada). Ative apenas o que o trabalho realmente precisa.

O comportamento varia conforme o evento. Em PRs vindos de forks, o GITHUB_TOKEN tem permissões restritas e segredos não são disponibilizados, reduzindo risco de escrita indevida. O evento `pull_request_target` roda no contexto do repositório base e pode acessar segredos e permissões elevadas, portanto requer cautela, revisões e controles adicionais. PRs do Dependabot usam um contexto próprio, com gestão separada de segredos; evite depender de segredos do repositório nesses casos. Para publicar no GitHub Pages, os fluxos oficiais exigem `pages: write` e, em geral, `id-token: write` para uso de ações como `actions/deploy-pages`.

Como regra de menor privilégio, comece com leitura mínima, separe trabalhos que precisam escrever dos que só leem, evite qualquer escrita em PRs de forks e concentre permissões elevadas somente no trabalho de deploy quando for publicar no Pages.

## Exemplo

Exemplo 1 — Workflow com padrão mínimo e job que comenta em PR (apenas quando o evento for pull_request do mesmo repositório):

```yaml
name: Aula 18 — Permissões e GITHUB_TOKEN
on:
  pull_request:
    types: [opened, synchronize, reopened]

permissions:
  contents: read

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Testes de build (sem escrita)
        run: |
          echo "Executando testes..."

  comment:
    # Só comenta quando não é fork (evita escritas vindas de forks)
    if: ${{ github.event.pull_request.head.repo.fork == false }}
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - name: Comentar no PR
        run: |
          echo "Comentando no PR via API"
          # Exemplo ilustrativo; uma action própria faria a chamada
```

Exemplo 2 — Trabalho de deploy para GitHub Pages com permissões específicas:

```yaml
name: Deploy de Pages (exemplo)
on:
  workflow_dispatch:

permissions:
  contents: read

jobs:
  deploy-pages:
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment: github-pages
    steps:
      - name: Preparar artefatos de site
        run: |
          echo "Gerando site estático..."
      - name: Upload para Pages (exemplo conceitual)
        run: |
          echo "Enviando artefato para Pages..."
          # Em fluxos reais, utilize actions/upload-pages-artifact e actions/deploy-pages
```

Esses exemplos mostram um padrão mínimo global com elevação pontual por job, a prevenção de escrita em PRs de forks e o uso de permissões específicas para publicar no Pages (`pages: write` e `id-token: write`) apenas no job de deploy.

Links úteis (oficiais):
- permissions no YAML: https://docs.github.com/pt/actions/using-workflows/workflow-syntax-for-github-actions#permissions
- GITHUB_TOKEN e escopos: https://docs.github.com/pt/actions/security-guides/automatic-token-authentication

## Conclusão

Definir `permissions` de forma explícita e mínima no workflow e ajustar por job melhora a segurança e a previsibilidade do pipeline. Trate PRs de forks como não confiáveis (sem escrita), eleve permissões apenas quando necessário e, para casos como Pages ou OIDC, habilite escopos pontuais (`pages: write`, `id-token: write`). Isso reduz superfície de ataque e facilita auditoria.
