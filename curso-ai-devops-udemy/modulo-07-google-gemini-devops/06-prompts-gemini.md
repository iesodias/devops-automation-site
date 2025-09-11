---
id: prompts-gemini
title: Prompts Gemini
slug: /prompts-gemini
noindex: true
---

# Prompts Especializados para Gemini CLI

## Introdução

O poder do Gemini CLI está na capacidade de executar prompts especializados que geram comandos precisos e executáveis diretamente no terminal. Nesta aula, você aprenderá a criar e usar prompts eficazes para automação DevOps, especialmente focados em tarefas Azure, AWS e gerenciamento de infraestrutura.

Os prompts apresentados seguem as **melhores práticas de Prompt Engineering** que estudamos no Módulo 3, aplicando princípios como:
- **Give Direction**: Instruções claras sobre o papel e objetivo
- **Specify Format**: Formato específico de saída esperado
- **Provide Examples**: Parâmetros e contexto detalhados
- **Evaluate Quality**: Critérios de validação incluídos

## Pré-requisitos

Antes de executar estes prompts, certifique-se de que tem:

- **Gemini CLI** instalado e configurado (aula anterior)
- **Azure CLI** instalado e autenticado (`az login`)
- **Permissões apropriadas** na sua subscription Azure
- **API Key** do Google AI Studio configurada
- **Terminal** com acesso aos comandos necessários

## Prompts para Azure DevOps

### 1. Criar Resource Group

```yaml
Aja como um especialista em Azure CLI.

Objetivo: Criar um novo Resource Group para hospedar recursos de um projeto DevOps.

Parâmetros:
- Nome: devopsautomation-rg
- Localização: eastus

Instruções:
1. Gere e execute o comando completo no Azure CLI
2. Após a execução, descreva em no máximo 3 frases o que foi feito, incluindo o nome do recurso, a localização e o objetivo dele no projeto
```

**Como usar:**
```bash
gemini "Aja como um especialista em Azure CLI. Objetivo: Criar um novo Resource Group para hospedar recursos de um projeto DevOps. Parâmetros: Nome: devopsautomation-rg, Localização: eastus. Instruções: 1. Gere e execute o comando completo no Azure CLI 2. Após a execução, descreva em no máximo 3 frases o que foi feito."
```

### 2. Criar Storage Account

```yaml
Aja como um especialista em Azure CLI.

Objetivo: Criar um Storage Account dentro do Resource Group devopsautomation-rg.

Parâmetros:
- Nome: devopsautostg123
- Localização: eastus
- SKU: Standard_LRS

Instruções:
1. Gere e execute o comando completo no Azure CLI
2. Após a execução, descreva em no máximo 3 frases o que foi feito, incluindo o nome do recurso, a localização, o SKU e para que ele será usado no projeto
```

**Nota importante**: O nome foi ajustado de `devopsautomationstorage123` (24 caracteres) para `devopsautostg123` (16 caracteres) para respeitar o limite de 24 caracteres do Azure.

### 3. Criar Container no Storage Account

```yaml
Aja como um especialista em Azure CLI.

Objetivo: Criar um container chamado logs no Storage Account devopsautostg123.

Parâmetros:
- Nome do container: logs
- Acesso público: private
- Resource Group: devopsautomation-rg

Instruções:
1. Gere e execute o comando completo no Azure CLI
2. Após a execução, descreva em no máximo 3 frases o que foi feito, incluindo o nome do container, nível de acesso e a relação dele com o projeto
```

### 4. Criar Azure Container Registry

```yaml
Aja como um especialista em Azure CLI.

Objetivo: Criar um Azure Container Registry para armazenar imagens de containers do projeto.

Parâmetros:
- Nome: devopsautomationacr
- Resource Group: devopsautomation-rg
- Localização: eastus
- SKU: Basic

Instruções:
1. Gere e execute o comando completo no Azure CLI
2. Após a execução, descreva em no máximo 3 frases o que foi feito, incluindo o nome do ACR, a localização, o SKU e o papel dele no fluxo de deploy
```

**Dica**: O nome `devopsautomationacr` tem 21 caracteres, respeitando os limites do Azure Container Registry.

### 5. Criar Azure Container App

```yaml
Aja como um especialista em Azure CLI.

Objetivo: Criar um Azure Container App usando uma imagem hospedada no Azure Container Registry devopsautomationacr.

Parâmetros:
- Nome: devopsautomationapp
- Resource Group: devopsautomation-rg
- Imagem: devopsautoacreie.azurecr.io/meuapp:latest
- Porta: 8080
- Tráfego externo habilitado

Instruções:
1. Gere e execute o comando completo no Azure CLI
2. Após a execução, descreva em no máximo 3 frases o que foi feito, incluindo o nome do Container App, a imagem usada, a porta exposta e o motivo de habilitar tráfego externo
```

## Padrões de Prompts Eficazes

### Estrutura Recomendada

1. **Papel/Persona**: "Aja como um especialista em [tecnologia]"
2. **Objetivo Claro**: Descrição específica do que precisa ser feito
3. **Parâmetros Detalhados**: Lista completa de configurações
4. **Instruções de Execução**: Passos específicos e formato de saída
5. **Validação**: Critérios de sucesso e explicação do resultado

### Dicas para Melhores Resultados

- **Seja específico**: Inclua todos os parâmetros necessários
- **Use contexto**: Mencione o projeto e objetivo final
- **Peça explicação**: Solicite descrição do que foi executado
- **Defina formato**: Especifique como quer a resposta
- **Evite ambiguidade**: Não deixe espaço para interpretação
- **Não omita detalhes**: Parâmetros incompletos geram erros

## Próximos passos

Com estes prompts, você pode:

1. **Automatizar** criação de infraestrutura Azure
2. **Integrar** o Gemini CLI em scripts bash/shell
3. **Expandir** os prompts para outros provedores (AWS, GCP)
4. **Criar** templates reutilizáveis para sua equipe
5. **Desenvolver** pipelines CI/CD com IA integrada

Na próxima aula, exploraremos como usar o Gemini para análise de logs e troubleshooting em ambientes DevOps.
