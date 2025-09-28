---
id: yaml
title: YAML Básico para Workflows
---

# YAML Básico para Workflows

## Introdução
Antes de combinar eventos, jobs e steps, é essencial compreender a sintaxe YAML, já que cada workflow do GitHub Actions é um arquivo `.yml` ou `.yaml`. Erros simples de indentação ou estrutura são causas frequentes de falhas silenciosas, interpretações incorretas ou execução parcial. Esta aula apresenta os fundamentos necessários para ler, escrever e validar workflows de forma segura e previsível.

## Definição
YAML (YAML Ain't Markup Language) é um formato de serialização de dados legível por humanos usado para representar pares chave–valor, listas e estruturas hierárquicas através de indentação. No contexto de GitHub Actions, define a declaração do workflow: disparadores (`on`), agrupamentos de execução (`jobs`) e unidades de ação (`steps`).

## Explicação Técnica
### Estrutura Geral de um Workflow
Componentes de alto nível (ordem típica):
1. `name` (opcional) – rótulo exibido na interface.
2. `on` (obrigatório) – eventos que disparam a execução.
3. `permissions` (opcional) – ajustes de escopo do `GITHUB_TOKEN`.
4. `env` (opcional) – variáveis de ambiente globais.
5. `jobs` (obrigatório) – conjunto de jobs, cada um com seu bloco interno.

### Indentação
- Usa ESPAÇOS (nunca tabs). Recomenda-se 2 espaços por nível.
- O nível de indentação define hierarquia. Um item mal indentado altera o significado ou gera erro de parsing.

Exemplo incorreto (indentação inconsistente):
```
jobs:
 build:
    runs-on: ubuntu-latest
```
Correção:
```
jobs:
  build:
    runs-on: ubuntu-latest
```

### Chaves e Valores
Formato simples `chave: valor`:
```
name: CI
runs-on: ubuntu-latest
```
Strings podem ser:
- Não citadas: `name: CI`
- Com aspas duplas (permitem interpolação de escape): `name: "Meu Workflow"`
- Com aspas simples (mantêm literal): `name: 'Texto literal: ${{ nao_expande }}'`

### Listas
Duas formas equivalentes:
Inline:
```
branches: [ main, develop ]
```
Multilinha:
```
branches:
  - main
  - develop
```
A escolha é estilística; usar multilinha para listas maiores ou mais explícitas.

### Mapeamentos Aninhados
Estruturas chave–valor dentro de outros blocos:
```
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
```

### Comentários
Usar `#` em qualquer ponto da linha (exceto dentro de strings literais):
```
# Nome visível no GitHub
name: CI
```

### Blocos de Texto Multilinha
Usar `|` para preservar quebras; `>` para dobrar (unir em espaço simples):
```
run: |
  echo "Linha 1"
  echo "Linha 2"
```

### Expressões em GitHub Actions
Estruturas como `${{ github.repository }}` não são do YAML em si; são avaliadas pelo motor de expressão do GitHub após o parsing YAML. Devem permanecer literais dentro do arquivo.

### Variáveis de Ambiente (`env`)
Podem ser definidas em três níveis:
```
env:
  NODE_VERSION: '18'

jobs:
  build:
    env:
      APP_MODE: test
    steps:
      - name: Exemplo
        env:
          LOCAL_FLAG: enabled
        run: echo "${{ env.APP_MODE }} / $LOCAL_FLAG"
```
Resolução: step > job > workflow.

### Estrutura de `jobs`
Cada job tem obrigatoriamente `runs-on` e opcionalmente `needs`, `strategy`, `env`, `steps`.
```
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Instalar dependências
        run: npm ci
```

### Estrutura de `steps`
Cada step é um item de lista sob `steps:`:
- `uses:` referencia uma action reutilizável.
- `run:` executa comandos na shell do runner.
- `name:` rótulo exibido.
- `if:` condição booleana opcional.

Exemplo com ambos:
```
steps:
  - name: Obter código
    uses: actions/checkout@v4
  - name: Testes
    run: npm test
  - name: Condicional
    if: github.event_name == 'pull_request'
    run: echo "Rodando apenas em PR"
```

### Erros Frequentes
- Misturar tabs e espaços → falha de parsing.
- Esquecer `:` após chave.
- Indentar listas com nível errado.
- Duplicar chave no mesmo bloco (último valor prevalece silenciosamente em alguns parsers, podendo quebrar lógica).
- Colocar expressão `${{ }}` dentro de aspas simples esperando interpolação (permanece literal).

### Validação Rápida
- Linters/editor com suporte YAML (extensões ajudam a detectar indentação errada).
- Commit pequeno e observar parsing pela aba *Actions* (erros de sintaxe abortam antes de iniciar jobs).
- Evitar alterações múltiplas não relacionadas no mesmo workflow até consolidar base.

## Exemplo Prático
Workflow mínimo ilustrando conceitos de lista, mapeamento, variáveis e steps:
```yaml
name: Exemplo YAML Básico
on:
  push:
    branches: [ main ]

env:
  APP_NAME: demo

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Mostrar contexto
        run: |
          echo "Repo: ${{ github.repository }}"
          echo "App: $APP_NAME"
      - name: Executar somente em push
        if: github.event_name == 'push'
        run: echo "Disparado por push"
```

## Conclusão
Dominar YAML reduz atrito na construção de workflows: indentação consistente, uso correto de listas e mapeamentos e entendimento da separação entre sintaxe YAML e avaliação de expressões do GitHub evitam falhas recorrentes. Com esta base, adicionar camadas como múltiplos jobs, matrizes (`strategy.matrix`) e permissões explícitas torna-se progressão natural e segura.
