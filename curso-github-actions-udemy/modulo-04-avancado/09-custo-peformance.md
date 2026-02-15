---
id: custo-performance
title: "Custos, Performance e Limites"
---

# Custos, Performance e Limites

## Introdução

Minutos de execução e capacidade de executores são recursos finitos. Otimizar workflows reduz custos, acelera feedback e evita gargalos. Esta aula consolida práticas para tirar mais proveito de cache, matriz, concorrência e escopo de execução.

## Definição

Custos relacionam-se ao tempo de execução em executores hospedados, ao paralelismo e ao volume de transferências. Performance é o equilíbrio entre velocidade e confiabilidade, obtido com cache eficiente, paralelismo controlado e cancelamento de execuções obsoletas.

Links oficiais:
- Executores hospedados pelo GitHub: https://docs.github.com/pt/actions/using-github-hosted-runners/about-github-hosted-runners
- Cache/Artifacts: https://docs.github.com/pt/actions/using-workflows/caching-dependencies-to-speed-up-workflows

## Explicação Técnica

Reduza execuções desnecessárias filtrando triggers (branches, paths) e usando `concurrency` com `cancel-in-progress` para PRs com muitos commits. Aproveite cache para dependências determinísticas com chaves baseadas em lockfiles e evite caches enormes.

Ajuste `matrix` para cobrir apenas combinações relevantes e limite `max-parallel` conforme a cota. Separe jobs para isolar partes que exigem permissões ou ambientes diferentes, evitando refazer trabalho. Artefatos devem ser usados de forma comedida — guarde somente o que agrega valor a etapas seguintes.

Minimize downloads repetidos utilizando caches de linguagem/ecossistema (npm, pip, maven). Considere reuso de camadas (em builds Docker) e invalidações inteligentes. Em repositórios grandes, adote estratégias de “build afetado” (executar somente para caminhos alterados) com `paths`/`paths-ignore`.

## Exemplo

Exemplo conceitual combinando filtros de trigger, cache e concorrência para PRs.

```yaml
name: Aula 27 — Custo e Performance
on:
  pull_request:
    branches: [ main ]
    paths:
      - "src/**"
      - "package.json"
      - "package-lock.json"

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Cache npm
        uses: actions/cache@v4
        with:
          path: ~/.npm
          key: npm-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            npm-${{ runner.os }}-
      - name: Build
        run: |
          echo "Executando build apenas para mudanças relevantes"
```

O workflow dispara apenas quando arquivos relevantes mudam, reutiliza dependências cacheadas e cancela execuções antigas do mesmo PR, reduzindo minutos e acelerando feedback.

## Conclusão

Corte desperdícios antes de acelerar: rode apenas o necessário, cancele o obsoleto e reuse o que for determinístico. Com bom uso de triggers, cache, matriz e concorrência, você reduz custos sem sacrificar qualidade.
