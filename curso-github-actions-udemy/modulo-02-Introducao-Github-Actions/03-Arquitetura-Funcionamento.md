---
id: arquitetura
title: Arquitetura e Funcionamento do GitHub Actions
---

# Arquitetura e Funcionamento do GitHub Actions

## Introdução

Compreender a arquitetura interna do GitHub Actions é fundamental para otimizar workflows e tomar decisões técnicas assertivas. Esta seção explora como os workflows são processados, os tipos de runners disponíveis e as limitações da plataforma.

## Definição

A arquitetura do GitHub Actions é baseada em um sistema distribuído de processamento de workflows, onde eventos disparam execuções que são enfileiradas e distribuídas para runners disponíveis. O sistema gerencia recursos, escalabilidade e isolamento automaticamente.

## Explicação Técnica

### 1. Como os Workflows são Processados

O processamento de workflows segue um ciclo bem definido que inicia com um **Trigger Event** (evento disparador), passa pelo **Workflow Parser** (analisador de workflow) que interpreta o arquivo YAML, seguido pelo **Job Queue** (fila de jobs) onde as tarefas aguardam disponibilidade de recursos.

Após isso, ocorre o **Runner Allocation** (alocação de runner), onde o sistema seleciona uma máquina virtual adequada, seguido do **Environment Setup** (configuração do ambiente) que prepara o sistema operacional e ferramentas necessárias. Em seguida, temos o **Step Execution** (execução de steps) sequencial conforme definido no workflow, **Cleanup** (limpeza) automática do ambiente e por fim o **Results Storage** (armazenamento de resultados) em artifacts.

O processamento permite execução paralela por padrão entre jobs independentes, enquanto jobs com dependências (definidas por `needs`) executam sequencialmente. Matrix jobs criam múltiplas execuções paralelas com diferentes configurações, multiplicando eficiência e cobertura de testes.

### 2. Runners Hospedados vs Self-hosted

**GitHub-hosted Runners** são máquinas virtuais totalmente gerenciadas pelo GitHub, oferecendo ambiente limpo a cada execução. Possuem recursos fixos (2 cores, 7GB RAM, 14GB SSD) e são pré-configurados com ferramentas comuns de desenvolvimento. O isolamento é garantido automaticamente, mas a customização é limitada.

**Self-hosted Runners** são sistemas que você próprio deploya e gerencia. Podem ser físicos, virtuais, em containers, locais ou na nuvem. Oferecem controle total sobre hardware, sistema operacional e software instalado, mas exigem manutenção manual e responsabilidade por segurança.

A comparação revela trade-offs: GitHub-hosted oferece conveniência e isolamento automático com custos em minutos cobrados, enquanto self-hosted proporciona flexibilidade total e economia (apenas custos de infraestrutura) em troca de responsabilidade de gerenciamento.

### 3. Sistemas Operacionais Disponíveis

**Ubuntu (Linux)** é o ambiente mais popular, oferecendo `ubuntu-latest` (22.04), `ubuntu-22.04` e `ubuntu-20.04` (descontinuado). Vem com Docker, Node.js, Python, Java, Maven, Gradle e ferramentas de linha de comando pré-instaladas.

**Windows** disponibiliza `windows-latest` (Server 2022), `windows-2022` e `windows-2019`. Inclui Git, Node.js, Python, .NET, PowerShell e Chocolatey para gerenciamento de pacotes.

**macOS** oferece `macos-latest` (Monterey), `macos-12` e `macos-11`. Contém Xcode, Swift, Homebrew e ferramentas de desenvolvimento Apple, ideal para builds iOS/macOS.

Cada sistema possui conjunto específico de ferramentas pré-instaladas, atualizadas regularmente pelo GitHub para manter compatibilidade com tecnologias atuais.

### 4. Limites e Cotas da Plataforma

#### Tabela de Limites e Cotas

| Recurso | Repositório Público | Repositório Privado |
|---------|--------------------|--------------------|
| **Minutos/mês** | Ilimitado | 2.000 (Free) / 3.000 (Pro) |
| **Armazenamento** | 500 MB | 500 MB / 1 GB |
| **Jobs Concurrent** | 20 | 5 (Free) / 15 (Pro) |
| **Timeout por Job** | 360 minutos | 360 minutos |
| **Workflow Execution** | 1.000 por hora | 1.000 por hora |
| **API Requests** | 1.000 por hora | 1.000 por hora |

Repositórios públicos têm uso gratuito ilimitado para runners padrão, incentivando contribuições open source. Repositórios privados possuem cotas baseadas no plano da conta, com cobrança adicional quando excedidas.

O sistema implementa otimizações como verificações rápidas antes de builds completos, cache inteligente de dependências e cleanup automático para economizar recursos e tempo.

## Exemplo Prático

Na prática, a arquitetura se manifesta quando um desenvolvedor faz push para o branch main. O sistema detecta o evento, analisa o arquivo YAML na pasta `.github/workflows/`, enfileira os jobs definidos e aloca runners conforme disponibilidade.

Se o workflow define múltiplos jobs sem dependências, eles executam paralelamente. Jobs com `needs` aguardam conclusão de predecessores. Matrix strategies criam múltiplas instâncias do mesmo job com configurações diferentes.

## Output Esperado

A execução revela informações detalhadas sobre:
- **Sistema**: Identificação do OS, arquitetura, recursos disponíveis
- **Runner**: Tipo utilizado, especificações, tempo de alocação
- **Performance**: Duração de cada step, uso de recursos, throughput
- **Artefatos**: Logs detalhados, arquivos gerados, métricas de execução

## Conclusão

A arquitetura do GitHub Actions combina simplicidade na interface com robustez na infraestrutura. O sistema distribuído garante escalabilidade automática, enquanto as opções de runners oferecem flexibilidade entre conveniência (GitHub-hosted) e controle total (self-hosted).

Compreender esses fundamentos permite construir workflows eficientes, escolher runners adequados ao contexto e otimizar custos respeitando limites da plataforma. A arquitetura incentiva boas práticas através de suas limitações, resultando em soluções mais sustentáveis e performáticas.