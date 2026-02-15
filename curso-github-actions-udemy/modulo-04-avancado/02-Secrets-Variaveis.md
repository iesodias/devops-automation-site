---
id: secrets
title: "Secrets & Variáveis no GitHub Actions"
---

# Variáveis (env/vars) e Segredos: Escopos e Precedência

## Introdução

Variáveis e segredos são a cola que conecta configurações do repositório ao seu pipeline. Compreender onde declarar, como herdam valores e quais limitações de uso existem evita comportamentos inesperados e reduz riscos de segurança. Nesta aula, organizamos env, vars e secrets, com foco em precedência e uso seguro no YAML e no shell.

## Definição

Variáveis de ambiente (env) são pares chave-valor definidos no workflow, no job ou no step, herdando por escopos. Você pode referenciá-las como `${{ env.NOME }}` no YAML ou `$NOME` dentro de comandos de shell. Já as variáveis do contexto vars são gerenciadas pela organização, pelo repositório ou por ambientes (environments) via interface do GitHub, e servem para valores não sensíveis. Segredos (secrets) guardam informações confidenciais com mascaramento automático de logs e controle de escopo por organização, repositório e ambiente.

Links oficiais:
- env (workflow syntax): https://docs.github.com/pt/actions/using-workflows/workflow-syntax-for-github-actions#env
- Contextos (vars e secrets): https://docs.github.com/pt/actions/learn-github-actions/contexts
- Condicionais em steps (if): https://docs.github.com/pt/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idstepsif

## Explicação Técnica

A precedência de env respeita o escopo mais específico: valores definidos no step sobrescrevem os definidos no job, que por sua vez sobrescrevem os do topo do workflow. Essa hierarquia ajuda a definir padrões gerais e exceções pontuais onde necessário. No uso, prefira `${{ env.VAR }}` quando preencher campos do YAML e `$VAR` dentro de `run:` em shell, para evitar confusão entre avaliação de expressões e expansão de variáveis.

Para vars, o GitHub oferece níveis hierárquicos por organização, repositório e ambiente. Quando um job aponta para um environment, as `vars` desse ambiente prevalecem sobre as do repositório e, por fim, sobre as da organização. Esse modelo permite que você defina um mesmo nome (por exemplo, `APP_ENV`) com valores diferentes por ambiente, mantendo consistência de chaves e reduzindo duplicidade.

Segredos (secrets) devem ser mapeados para `env:` antes de uso no shell, e nunca devem ser impressos. Em PRs vindos de forks, segredos do repositório não são disponibilizados; isso protege contra exposições acidentais. Ao reutilizar workflows (`workflow_call`), use `secrets: inherit` com cuidado ou declare explicitamente os segredos aceitos como inputs para manter controle. Em algumas propriedades, como certos usos de `if`, `secrets` pode não estar disponível; preferencialmente, faça gating com `vars`/`github` ou mova a lógica para o shell, consumindo o segredo via `env` sem ecoar o valor.

Boas práticas incluem nomear variáveis de forma clara, centralizar valores não sensíveis em `vars` e separar segredos por ambiente usando Environments com proteções. Evite duplicar valores em muitos lugares; confie na precedência e documente no topo do arquivo onde cada conjunto é definido.

## Exemplo

Este exemplo demonstra a precedência de env, o uso de vars por ambiente, e o mapeamento seguro de secrets para o shell. É conceitual e compatível com executores Linux.

```yaml
name: Aula 19 — Variáveis e Segredos
on:
  workflow_dispatch:

env:
  APP_NAME: demo-app            # escopo do workflow
  LOG_LEVEL: info

jobs:
  build:
    runs-on: ubuntu-latest
    environment: prod           # ativa vars e secrets do ambiente "prod"
    env:
      LOG_LEVEL: warn           # sobrescreve o valor do workflow neste job
      APP_ENV: ${{ vars.APP_ENV }}  # usa vars do ambiente/repo/org conforme o environment
    steps:
      - name: Mostrar env herdado e precedence
        env:
          APP_NAME: step-override   # sobrescreve o job/workflow apenas neste step
        run: |
          echo "APP_NAME (step): ${APP_NAME}"
          echo "LOG_LEVEL (job): ${LOG_LEVEL}"
          echo "APP_ENV (vars): ${APP_ENV:-dev}"

      - name: Mapear segredo para o shell com segurança
        env:
          API_TOKEN: ${{ secrets.API_TOKEN }}
        run: |
          echo "Usando token em chamada (valor não impresso)"
          # Exemplo: curl -H "Authorization: Bearer ${API_TOKEN}" https://api.exemplo.local/health
          echo "Token está mascarado por padrão e não será exibido nos logs"

      - name: Condicional usando vars (evitar secrets diretamente em if)
        if: ${{ vars.APP_ENV == 'prod' }}
        run: |
          echo "Executando etapa somente em prod"
```

O que observar no exemplo: o `APP_NAME` definido no step prevalece apenas naquele step; o `LOG_LEVEL` do job substitui o do workflow no job inteiro; `APP_ENV` vem de `vars`, com precedência do environment. O segredo `API_TOKEN` é mapeado para `env` e usado no shell sem impressão do valor. A condicional `if` utiliza `vars` em vez de `secrets` para evitar indisponibilidade e exposição.

## Conclusão

Dominar env, vars e secrets passa por entender onde declarar, como a precedência se aplica e quando cada um deve ser usado. Defina padrões no topo do workflow, ajuste no job e, quando necessário, no step. Centralize valores não sensíveis em `vars` e segregue segredos por ambiente, sempre mapeando-os para `env` antes de usar no shell. Com essas práticas, seus workflows ficam previsíveis, seguros e fáceis de manter.
