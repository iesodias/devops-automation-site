---
id: componentes
title: Componentes do GitHub Actions
---

# Componentes do GitHub Actions

## Introdução

Para dominar o GitHub Actions, é essencial compreender seus componentes fundamentais. Cada elemento trabalha em harmonia para criar um sistema robusto de automação. Esta estrutura modular permite construir desde simples verificações até complexos pipelines de deployment.

## Definição

Os componentes do GitHub Actions formam uma arquitetura hierárquica onde cada elemento tem responsabilidades específicas:

- **Workflows**: Orquestram todo o processo
- **Events**: Definem quando executar
- **Jobs**: Organizam o trabalho
- **Steps**: Executam as tarefas
- **Actions**: Reutilizam funcionalidades
- **Runners**: Fornecem o ambiente de execução

## Explicação Técnica

### 1. Workflows
Processos automatizados definidos em arquivos YAML na pasta `.github/workflows/`:

```yaml
name: Complete CI/CD Pipeline
on:
  push:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * 1'  # Segunda-feira às 2h
    
env:
  JAVA_VERSION: '17'
  
jobs:
  test:
    # Job de teste
  build:
    # Job de build
  deploy:
    # Job de deploy
```

### 2. Events
Eventos que acionam workflows automaticamente:

```yaml
on:
  # Push em branches específicas
  push:
    branches: [ main, develop ]
    paths: [ 'src/**', 'pom.xml' ]
    
  # Pull requests
  pull_request:
    branches: [ main ]
    types: [ opened, synchronize, reopened ]
    
  # Agendamento (cron)
  schedule:
    - cron: '30 5 * * 1-5'  # Dias úteis às 5:30
    
  # Trigger manual
  workflow_dispatch:
    inputs:
      environment:
        description: 'Ambiente de deploy'
        required: true
        default: 'staging'
        type: choice
        options: ['staging', 'production']
        
  # Criação de release
  release:
    types: [ published ]
```

### 3. Jobs
Conjunto de steps que executam no mesmo runner:

```yaml
jobs:
  test:
    name: 'Testes Unitários'
    runs-on: ubuntu-latest
    strategy:
      matrix:
        java-version: [ 11, 17, 21 ]
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Java ${{ matrix.java-version }}
      uses: actions/setup-java@v4
      with:
        java-version: ${{ matrix.java-version }}
        distribution: 'corretto'
        
  build:
    name: 'Build da Aplicação'
    needs: test  # Dependência entre jobs
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'  # Condicional
    
    outputs:
      artifact-name: ${{ steps.build.outputs.artifact }}
      
    steps:
    - name: Build
      id: build
      run: |
        ./mvnw clean package
        echo "artifact=devops-api-$(date +%Y%m%d).jar" >> $GITHUB_OUTPUT
```

### 4. Steps
Ações individuais executadas sequencialmente:

```yaml
steps:
  # Step usando action pré-construída
  - name: Checkout Repository
    uses: actions/checkout@v4
    with:
      fetch-depth: 0
      
  # Step com comando personalizado
  - name: Cache Dependencies
    uses: actions/cache@v4
    with:
      path: ~/.m2
      key: ${{ runner.os }}-maven-${{ hashFiles('**/pom.xml') }}
      restore-keys: |
        ${{ runner.os }}-maven-
        
  # Step com script customizado
  - name: Run Custom Script
    run: |
      echo "Iniciando build..."
      chmod +x ./scripts/build.sh
      ./scripts/build.sh
      echo "Build concluído!"
      
  # Step condicional
  - name: Deploy to Production
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    run: echo "Deploying to production..."
```

### 5. Actions
Aplicações reutilizáveis para tarefas específicas:

```yaml
# Action do marketplace
- name: Deploy to AWS
  uses: aws-actions/configure-aws-credentials@v4
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: us-east-1

# Action local customizada
- name: Custom Notification
  uses: ./.github/actions/notify-teams
  with:
    webhook-url: ${{ secrets.TEAMS_WEBHOOK }}
    message: 'Deploy concluído com sucesso!'

# Action composta (composite)
- name: Setup Build Environment
  uses: ./.github/actions/setup-build
  with:
    java-version: '17'
    node-version: '18'
```

### 6. Runners
Máquinas virtuais que executam os workflows:

```yaml
jobs:
  # Runner GitHub-hosted
  ubuntu-job:
    runs-on: ubuntu-latest  # ubuntu-20.04, ubuntu-22.04
    
  windows-job:
    runs-on: windows-latest  # windows-2019, windows-2022
    
  macos-job:
    runs-on: macos-latest   # macos-11, macos-12
    
  # Self-hosted runner
  custom-job:
    runs-on: [ self-hosted, linux, x64 ]
    
  # Runner com container
  container-job:
    runs-on: ubuntu-latest
    container:
      image: amazoncorretto:17
      options: --user root
```

## Exemplo Prático

Workflow completo integrando todos os componentes:

```yaml
name: Spring Boot CI/CD Complete
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    name: 'Testes e Qualidade'
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Java
      uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'corretto'
        
    - name: Cache Maven
      uses: actions/cache@v4
      with:
        path: ~/.m2
        key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}
        
    - name: Run Tests
      run: ./mvnw test
      env:
        SPRING_PROFILES_ACTIVE: test
        
    - name: Generate Coverage Report
      run: ./mvnw jacoco:report
      
    - name: Upload Coverage
      uses: codecov/codecov-action@v4
      with:
        file: ./target/site/jacoco/jacoco.xml

  build:
    name: 'Build e Docker'
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    outputs:
      image-digest: ${{ steps.build.outputs.digest }}
      
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Java
      uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'corretto'
        
    - name: Build Application
      run: ./mvnw clean package -DskipTests
      
    - name: Log into Registry
      uses: docker/login-action@v3
      with:
        registry: ${{ env.REGISTRY }}
        username: ${{ github.actor }}
        password: ${{ secrets.GITHUB_TOKEN }}
        
    - name: Build and Push Docker
      id: build
      uses: docker/build-push-action@v5
      with:
        context: .
        push: true
        tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
        
  deploy:
    name: 'Deploy Staging'
    needs: build
    runs-on: ubuntu-latest
    environment: staging
    
    steps:
    - name: Deploy to Staging
      run: |
        echo "Deploying image: ${{ needs.build.outputs.image-digest }}"
        echo "Deploy simulado para staging"
```

## Output Esperado

Execução do workflow acima produzirá:
1. **Job Test**: Testes executados com cobertura e qualidade verificada
2. **Job Build**: Aplicação compilada e imagem Docker criada
3. **Job Deploy**: Deploy automático para staging
4. **Artifacts**: Relatórios, logs e imagens Docker disponíveis
5. **Feedback**: Status visual no GitHub com detalhes de cada step

## Conclusão

Os componentes do GitHub Actions trabalham em conjunto para criar um ecossistema completo de automação. Workflows orquestram, Events disparam, Jobs organizam, Steps executam, Actions reutilizam e Runners provêm o ambiente. Esta arquitetura modular oferece flexibilidade máxima, permitindo desde automações simples até pipelines corporativos complexos.

Dominar cada componente é essencial para construir soluções robustas, eficientes e maintíveis, aproveitando todo o potencial da plataforma GitHub Actions.