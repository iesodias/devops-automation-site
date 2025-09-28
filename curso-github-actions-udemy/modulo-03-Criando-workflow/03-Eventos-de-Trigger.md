---
id: triggers
title: Eventos de Trigger no GitHub Actions
---

# Eventos de Trigger no GitHub Actions

## Introdução

Os eventos de trigger (ou gatilhos) são fundamentais para determinar quando e como seus workflows do GitHub Actions devem ser executados. Eles definem as condições específicas que iniciam a execução automatizada dos seus pipelines, oferecendo total controle sobre quando suas ações devem acontecer.

## Definição

Os eventos de trigger são configurações declarativas no arquivo YAML do workflow que especificam em quais circunstâncias o GitHub deve executar suas automações. Cada evento possui suas próprias características e pode ser combinado com filtros para criar gatilhos mais específicos e eficientes.

## Explicação Técnica

### 1. Evento `push` - Executar em Commits

O evento `push` é acionado sempre que há commits enviados para o repositório.

```yaml
on:
  push:
    branches: [ main, develop ]
    paths: 
      - 'src/**'
      - '!src/tests/**'
```

### 2. Evento `pull_request` - Executar em PRs

Acionado quando pull requests são abertos, atualizados ou fechados.

```yaml
on:
  pull_request:
    types: [opened, synchronize, closed]
    branches: [ main ]
    paths-ignore:
      - 'docs/**'
      - '*.md'
```

### 3. Evento `schedule` - Execução Agendada

Permite execução baseada em cronograma usando sintaxe cron.

```yaml
on:
  schedule:
    - cron: '0 2 * * 1-5'  # Segunda a sexta, 2h da manhã
    - cron: '0 0 * * 0'    # Domingo à meia-noite
```

### 4. Evento `workflow_dispatch` - Execução Manual

Habilita execução manual com parâmetros opcionais.

```yaml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy'
        required: true
        default: 'staging'
        type: choice
        options:
        - staging
        - production
      version:
        description: 'Version number'
        required: false
        type: string
```

### 5. Evento `issues` - Automação Baseada em Issues

Responde a ações realizadas em issues do repositório.

```yaml
on:
  issues:
    types: [opened, labeled, closed]
```

### Filtros de Branches e Paths

Os filtros permitem especificar exatamente quando o workflow deve executar:

```yaml
on:
  push:
    branches: 
      - main
      - 'release/**'
      - '!feature/experimental'
    paths:
      - 'src/**'
      - 'package*.json'
    paths-ignore:
      - 'docs/**'
      - '**.md'
```

## Exemplo Prático

Aqui está um workflow completo demonstrando múltiplos eventos:

```yaml
name: Multi-Trigger Pipeline

on:
  push:
    branches: [ main ]
    paths: [ 'src/**', 'package*.json' ]
  
  pull_request:
    branches: [ main ]
    types: [opened, synchronize]
  
  schedule:
    - cron: '0 9 * * 1'  # Segunda-feira às 9h
  
  workflow_dispatch:
    inputs:
      run_tests:
        description: 'Execute tests'
        type: boolean
        default: true

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        if: github.event_name == 'pull_request' || inputs.run_tests
        run: npm test
      
      - name: Build project
        run: npm run build
```

## Conclusão

Os eventos de trigger fornecem flexibilidade total para automatizar seus workflows. Combinando diferentes eventos com filtros apropriados, você pode criar pipelines eficientes que executam apenas quando necessário, economizando recursos e tempo. A chave está em escolher os eventos corretos e configurar os filtros adequados para cada cenário específico do seu projeto.