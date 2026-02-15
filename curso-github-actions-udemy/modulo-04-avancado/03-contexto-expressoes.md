---
id: contex-exp
title: "Contextos e Expressões no GitHub Actions (Fundamentos)"
---

# Contextos e Expressões no GitHub Actions (Fundamentos)

## Introdução

Antes de criar condições, reutilizar saídas de steps ou montar estratégias de execução, é essencial entender dois pilares do GitHub Actions: contextos e expressões. Eles determinam “o que está disponível” e “como calcular” valores no YAML, permitindo escrever workflows mais claros, seguros e previsíveis.

## Definição

Contextos são estruturas de dados expostas pelo GitHub Actions durante a execução do workflow, como `github`, `env`, `vars`, `secrets`, `runner`, `steps`, `needs` e `matrix`. Eles representam “o que está disponível” para consulta e decisão no pipeline.

Expressões são trechos avaliados dentro de `${{ ... }}` que acessam esses contextos, aplicam operadores e chamam funções (por exemplo, `hashFiles`, `toJSON`, `fromJSON`). Elas aparecem em campos como `if:`, `env:`, `with:` e também dentro de strings interpoladas do YAML.

Documentação oficial:
- Contextos: https://docs.github.com/pt/actions/learn-github-actions/contexts
- Expressões: https://docs.github.com/pt/actions/learn-github-actions/expressions

## Explicação Técnica

Você usa contextos para decidir a execução, parametrizar ações e compor nomes. Em `if:`, por exemplo, é comum habilitar ou ignorar um step com `if: ${{ github.event_name == 'push' }}`. Em `env:`, valores de `vars` podem alimentar variáveis do step, como `APP_ENV`. Em `with:`, inputs de ações podem receber dados vindos de `env`, `vars` ou `steps.outputs`. Strings interpoladas também avaliam expressões, como em `name: Build (${{ matrix.os }})`.

Sobre os principais contextos: `github` expõe metadados do evento e da execução (repositório, branch, SHA, ator, tipo de evento) e costuma embasar condicionais e logs. `env` agrega variáveis de ambiente definidas no workflow, job ou step, facilitando o uso em comandos de shell. `vars` reúne variáveis gerenciadas pela organização, repositório ou ambiente, ideais para valores não sensíveis e versionáveis pela interface do GitHub. `secrets` guarda dados confidenciais mascarados; passe-os para actions ou comandos via `env`/`with`, evitando qualquer impressão em logs. `runner` informa sistema operacional e arquitetura do executor, útil para mensagens e caminhos específicos. `steps` permite acessar `steps.<id>.outputs.*` e conclusões de steps anteriores, desde que tenham um `id` definido. `needs` dá acesso a saídas e conclusões de jobs dos quais o atual depende. Por fim, `matrix` contém os valores da combinação ativa no job com `strategy.matrix`.

Nem todo contexto está disponível em qualquer lugar do YAML. Por exemplo, `secrets` não é aceito em `runs-on`, e algumas propriedades não avaliam expressões. Consulte a documentação do campo antes de usar um contexto específico. Evite referenciar segredos diretamente em `if:` quando não suportado; em vez disso, mapeie-os para `env:` no step e consuma-os no shell sem ecoar valores. Lembre-se de que `steps` e `needs` dependem de `id` e nomes corretos definidos anteriormente; um erro de digitação resulta em valores vazios. E `matrix` só existe dentro do job que define `strategy.matrix`.

Expressões seguem a sintaxe `${{ <expressão> }}` e aceitam operadores lógicos e de comparação (`&&`, `||`, `==`, `!=`) além de funções úteis. `hashFiles('**/package-lock.json')` gera um hash determinístico para chaves de cache. `toJSON(obj)` serializa um contexto para string JSON, excelente para depurar estruturas como `matrix` (não use com segredos). `fromJSON(str)` faz o caminho inverso e permite reconstruir objetos a partir de strings — um padrão comum para montar `matrix` dinamicamente a partir de outputs.

Boas práticas úteis:
- Escreva condições explícitas, comparando com valores concretos (por exemplo, `github.ref == 'refs/heads/main'`).
- Não imprima segredos; quando indispensável, confie no mascaramento automático e considere `::add-mask::`.
- Use `toJSON` apenas com dados não sensíveis (como `matrix`).
- Dê nomes (`id`) claros aos steps para reutilizar `steps.<id>.outputs.*` com segurança.

## Exemplo

Workflow teórico (sem dependências externas), compatível com executores Linux, mostrando usos básicos de contextos e expressões:

```yaml
name: Aula 17 — Contextos e Expressões
on:
  workflow_dispatch:
  push:
    branches: [ main ]

jobs:
  info:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        os: [ubuntu-latest]
        node: [18]
    steps:
      - name: Exibir metadados do evento
        run: |
          echo "Evento: ${{ github.event_name }}"
          echo "Branch/Ref: ${{ github.ref }}"
          echo "Actor: ${{ github.actor }}"
          echo "Runner OS: ${{ runner.os }}"

      - name: Definir variável de ambiente a partir de vars
        env:
          APP_ENV: ${{ vars.APP_ENV }}
        run: |
          echo "Ambiente lógico: ${APP_ENV:-dev}"

      - id: prepara
        name: Preparar saída de step
        run: |
          echo "value=ok" >> "$GITHUB_OUTPUT"

      - name: Usar saída do step anterior
        if: ${{ steps.prepara.outputs.value == 'ok' }}
        run: |
          echo "Step anterior retornou 'ok' — executando ação condicionada"

      - name: Depurar matrix em JSON (sem dados sensíveis)
        run: |
          echo "Matrix: ${{ toJSON(matrix) }}"
```

Este exemplo demonstra a leitura de metadados (`github.*`, `runner.*`), o uso de `vars` para alimentar `env` em um step sem expor segredos, a produção e o consumo de saídas de steps via `GITHUB_OUTPUT`, a aplicação de `if:` baseada em `steps.prepara.outputs.value` e uma depuração segura com `toJSON(matrix)`.

Links úteis (oficiais):
- Contextos: https://docs.github.com/pt/actions/learn-github-actions/contexts
- Expressões e funções: https://docs.github.com/pt/actions/learn-github-actions/expressions

## Conclusão

Contextos revelam “o que” está disponível em cada ponto do workflow, enquanto expressões determinam “como” combinar e avaliar essas informações. Dominar ambos permite criar condições corretas, encadear saídas entre steps e jobs e depurar com rapidez. Consulte a documentação de cada campo para confirmar disponibilidade, trate segredos com rigor e prefira expressões claras e testáveis para manter workflows previsíveis e seguros.
