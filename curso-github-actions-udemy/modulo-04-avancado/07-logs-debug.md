---
id: logs-debug
title: "Logs, Debug"
---
# Logs, Debug e Problem Matchers

## Introdução

Diagnosticar falhas rapidamente depende de bons logs e ferramentas de depuração. O GitHub Actions oferece variáveis de debug, reexecução com logging detalhado, resumos por step e problem matchers para destacar erros no output.

## Definição

Debug em nível de executor e etapa pode ser ativado para imprimir detalhes adicionais de execução. Resumo de etapa (Step Summary) via `$GITHUB_STEP_SUMMARY` permite gerar um painel de resultados por etapa. Mapeadores de problemas (problem matchers) são padrões que convertem mensagens de log em anotações de erro/aviso na interface do GitHub.

Links oficiais:
- Debug logging: https://docs.github.com/pt/actions/monitoring-and-troubleshooting-workflows/enabling-debug-logging
- Step summary: https://docs.github.com/pt/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary
- Problem matchers: https://github.com/actions/toolkit/blob/main/docs/problem-matchers.md

## Explicação Técnica

Para habilitar debug sem alterar YAML, você pode clicar em “Re-run jobs” e marcar “Enable debug logging”. Alternativamente, definir os segredos `ACTIONS_RUNNER_DEBUG` e/ou `ACTIONS_STEP_DEBUG` como `true` ativa logs detalhados por padrão (aplicado ao workflow).

O resumo de etapa usa o arquivo apontado por `$GITHUB_STEP_SUMMARY`. Escrever markdown nele adiciona um resumo visível na interface do trabalho, útil para métricas, tabelas e resultados agregados.

Os mapeadores de problemas usam um arquivo JSON ou um comando especial para registrar um matcher. Quando um padrão casa com uma linha de log, o GitHub cria uma anotação associada ao arquivo/linha, facilitando a navegação até o problema.

## Exemplo

Exemplo com geração de summary e registro leve de matcher.

```yaml
name: Aula 24 — Logs e Debug
on: { workflow_dispatch: }

jobs:
  demo:
    runs-on: ubuntu-latest
    steps:
      - name: Gerar resumo do job
        shell: bash
        run: |
          echo "# Resultado do Job" >> "$GITHUB_STEP_SUMMARY"
          echo "- Status: OK" >> "$GITHUB_STEP_SUMMARY"

      - name: Registrar problem matcher simples (conceitual)
        run: |
          echo "::add-matcher::{\"problemMatcher\":[{\"owner\":\"demo\",\"pattern\":[{\"regexp\":\"ERROR:(.*)\"}]}]}"
          echo "ERROR: arquivo X com problema"
```

O primeiro step cria um resumo em markdown visível no job. O segundo registra, de forma conceitual, um problem matcher que detecta linhas iniciadas com `ERROR:` e gera anotações correspondentes.

## Conclusão

Habilitar debug quando necessário, produzir resumos claros e usar matchers para destacar erros tornam a investigação mais rápida e colaborativa. Padronize mensagens e resumos para que sua equipe encontre problemas em minutos, não horas.
