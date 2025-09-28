---
id: estrutura
title: Estrutura de Diretórios e Arquivos
---

# Estrutura de Diretórios e Arquivos

## Introdução

Criar seu primeiro workflow requer compreender a estrutura organizacional que o GitHub Actions utiliza. A organização correta de diretórios e arquivos é fundamental para que o sistema reconheça e execute seus workflows automaticamente.

## Definição

A estrutura de diretórios do GitHub Actions segue um padrão específico onde workflows são armazenados no diretório `.github/workflows/` na raiz do repositório. Cada arquivo YAML neste diretório representa um workflow independente que pode ser executado baseado em eventos configurados.

## Explicação Técnica

### 1. Diretório .github/workflows

O diretório `.github/workflows/` é o local obrigatório onde o GitHub procura por arquivos de workflow. Esta estrutura deve estar presente na raiz do repositório:

```
repositorio/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── deploy.yml
│       └── release.yml
├── src/
├── tests/
└── README.md
```

O GitHub Actions **automaticamente detecta** qualquer arquivo `.yml` ou `.yaml` neste diretório e o trata como um workflow. Não há necessidade de configuração adicional ou registro manual.

### 2. Convenções de Nomenclatura

**Extensões aceitas**: `.yml` e `.yaml` são ambas válidas, mas `.yml` é mais comum por ser mais concisa.

**Nomes descritivos** facilitam identificação:
```
ci.yml                    # Continuous Integration
deploy-production.yml     # Deploy para produção  
test-coverage.yml        # Cobertura de testes
security-scan.yml        # Análise de segurança
release-automation.yml   # Automação de releases
```

**Boas práticas de nomenclatura**:
- Use kebab-case (palavras separadas por hífen)
- Seja específico sobre o propósito
- Evite espaços e caracteres especiais
- Prefixe por ambiente quando necessário (`dev-`, `prod-`)

### 3. Sintaxe YAML Básica para Workflows

#### Estrutura Fundamental
```yaml
name: CI Pipeline
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Java
      uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'corretto'
        
    - name: Run tests
      run: ./mvnw test
```

#### Elementos Obrigatórios

**`name`** (opcional mas recomendado): Nome exibido na interface
```yaml
name: "Spring Boot CI/CD"
```

**`on`** (obrigatório): Define quando o workflow executa
```yaml
on:
  push:                    # Em push
  pull_request:           # Em pull request
  schedule:               # Agendado
    - cron: '0 2 * * 1'   # Segunda-feira às 2h
  workflow_dispatch:      # Manual
```

**`jobs`** (obrigatório): Define os trabalhos a executar
```yaml
jobs:
  test:
    name: 'Unit Tests'
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - run: npm test
    
  build:
    name: 'Build Application'  
    needs: test              # Executa após 'test'
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - run: npm run build
```

#### Sintaxe YAML Essencial

**Indentação**: Use 2 espaços (nunca tabs)
```yaml
jobs:          # Nível 0
  build:       # Nível 1 (2 espaços)
    runs-on:   # Nível 2 (4 espaços)
```

**Listas**: Use hífen seguido de espaço
```yaml
branches: [ main, develop ]
# ou
branches:
  - main
  - develop
```

**Strings**: Aspas opcionais, mas recomendadas para valores com espaços
```yaml
name: "My Workflow"
run: echo "Hello World"
```

**Multiline**: Use `|` para preservar quebras de linha
```yaml
run: |
  echo "Linha 1"
  echo "Linha 2"
  ./script.sh
```

#### Variáveis e Contextos
```yaml
env:
  NODE_VERSION: '18'
  
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Use environment variable
      run: echo "Node version: ${{ env.NODE_VERSION }}"
      
    - name: Access GitHub context
      run: |
        echo "Repository: ${{ github.repository }}"
        echo "Actor: ${{ github.actor }}"
        echo "SHA: ${{ github.sha }}"
```

## Output Esperado

Ao criar este workflow você verá:
- **Detecção automática** pelo GitHub na aba Actions
- **Execução** em push/PR conforme configurado  
- **Logs estruturados** mostrando cada step
- **Cache** de dependências para builds mais rápidos
- **Relatórios** de teste integrados à interface

## Conclusão

A estrutura de diretórios do GitHub Actions é simples mas poderosa. O diretório `.github/workflows/` centraliza toda automação, while convenções de nomenclatura clara facilitam manutenção. Dominar a sintaxe YAML básica permite criar workflows robustos que automatizam eficientemente seu pipeline de desenvolvimento.