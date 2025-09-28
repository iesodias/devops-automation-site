---
id: workflow-basico
title: Workflow Básico no GitHub Actions
---

# Workflow Básico no GitHub Actions

## Introdução

Um workflow básico é o alicerce de qualquer automação no GitHub Actions. Compreender sua estrutura fundamental é essencial para criar pipelines eficientes e organizados. Cada workflow representa um processo automatizado que será executado mediante condições específicas que você define.

## Definição

Um workflow básico no GitHub Actions é um arquivo YAML que define um processo automatizado contendo três elementos obrigatórios: `name` (identificação), `on` (eventos de trigger) e `jobs` (tarefas a serem executadas). Estes elementos formam a base de qualquer automação no GitHub.

## Explicação Técnica

### Elementos Obrigatórios

#### 1. `name` - Identificação do Workflow
Define o nome que aparecerá na interface do GitHub Actions.

```yaml
name: "Meu Primeiro Workflow"
```

#### 2. `on` - Eventos de Trigger
Especifica quando o workflow deve ser executado.

```yaml
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
```

#### 3. `jobs` - Tarefas do Workflow
Contém as tarefas que serão executadas. Cada job roda em um ambiente isolado.

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout código
        uses: actions/checkout@v4
      
      - name: Executar comando
        run: echo "Hello World!"
```

### Estrutura Completa Mínima

```yaml
name: Workflow Básico

on:
  push:
    branches: [ main ]

jobs:
  exemplo:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: echo "Workflow executado com sucesso!"
```

### Componentes Detalhados

#### Jobs
Cada job pode ter múltiplos `steps` e roda em paralelo por padrão:

```yaml
jobs:
  primeiro-job:
    runs-on: ubuntu-latest
    steps:
      - name: Passo 1
        run: echo "Executando passo 1"
      
      - name: Passo 2
        run: echo "Executando passo 2"
  
  segundo-job:
    runs-on: windows-latest
    steps:
      - name: Job no Windows
        run: echo "Executando no Windows"
```

#### Steps
Podem usar actions pré-construídas ou comandos shell:

```yaml
steps:
  # Usando action
  - name: Checkout
    uses: actions/checkout@v4
  
  # Usando comando shell
  - name: Listar arquivos
    run: ls -la
  
  # Comando multi-linha
  - name: Comandos múltiplos
    run: |
      echo "Primeira linha"
      echo "Segunda linha"
      pwd
```

### Localização do Arquivo

O workflow deve ser salvo em:
```
.github/
└── workflows/
    └── meu-workflow.yml
```

## Conclusão

Um workflow básico com `name`, `on` e `jobs` é a fundação de toda automação no GitHub Actions. Começar com uma estrutura simples e bem organizada facilita a evolução para workflows mais complexos. A chave está em manter a clareza na definição de cada elemento e gradualmente adicionar funcionalidades conforme a necessidade do projeto.