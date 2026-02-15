---
id: matrix-conc
title: "Matriz e Concorrência"
---

# Matriz e Concorrência: Padrões e Cuidados

## Introdução

Executar testes e builds em variações de sistema operacional, linguagem e versões melhora a qualidade, mas pode aumentar tempo e custo. A matriz (`strategy.matrix`) cria combinações de parâmetros para paralelizar trabalhos, e a concorrência (`concurrency`) evita que execuções obsoletas consumam recursos à toa.

## Definição

A matriz é um recurso do GitHub Actions que gera múltiplas instâncias de um mesmo trabalho a partir de listas de valores (por exemplo, `os`, `node`, `python`). Já a concorrência define um “grupo” de execução para cancelar ou bloquear execuções paralelas conflitantes, mantendo apenas a mais recente ativa quando aplicável.

Links oficiais:
- Matriz: https://docs.github.com/pt/actions/using-jobs/using-a-matrix-for-your-jobs
- Concorrência: https://docs.github.com/pt/actions/using-jobs/using-concurrency

## Explicação Técnica

Com `strategy.matrix`, você descreve eixos como `os` e `node`, e o Actions executa o trabalho para cada combinação. Opções como `fail-fast` (padrão true) encerram as demais combinações quando uma falha ocorre, o que pode economizar tempo mas esconder falhas subsequentes. `max-parallel` limita quantos trabalhos da matriz rodam ao mesmo tempo, controlando consumo de minutos.

A concorrência agrupa execuções por um identificador (por exemplo, `concurrency: group: ${{ github.workflow }}-${{ github.ref }}`). Quando `cancel-in-progress: true`, uma nova execução cancela as anteriores ainda em andamento no mesmo grupo, útil para PRs com muitos pushes seguidos.

Boas práticas: escolha eixos que realmente agreguem valor (por exemplo, SOs suportados), limite `max-parallel` quando o repositório tiver restrições de executores/minutos e avalie desligar `fail-fast` quando desejar observar todas as falhas de uma matriz complexa.

## Exemplo

Exemplo de matriz simples com `fail-fast: false`, `max-parallel` e cancelamento de execuções antigas por branch.

```yaml
name: Aula 22 — Matriz e Concorrência
on:
  push:
    branches: [ main ]
  pull_request:

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false
      max-parallel: 2
      matrix:
        os: [ubuntu-latest, windows-latest]
        node: [18, 20]
    steps:
      - name: Exibir combinação
        run: |
          echo "SO: ${{ matrix.os }} | Node: ${{ matrix.node }}"
```

Este exemplo executa quatro combinações (2 SOs × 2 versões de Node), com no máximo dois jobs simultâneos, sem interromper as demais combinações quando uma falha. A configuração de concorrência cancela execuções anteriores do mesmo branch quando um novo push chega.

## Conclusão

A matriz amplia cobertura de validação com pouco esforço de YAML. Já a concorrência evita retrabalho ao cancelar execuções defasadas. Combine `fail-fast`, `max-parallel` e `concurrency` para equilibrar velocidade, custo e visibilidade das falhas, de acordo com a estratégia do seu repositório.
