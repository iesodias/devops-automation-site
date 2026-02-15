---
id: copilot-agent-mode
title: GitHub Copilot Agent Mode
slug: /copilot-agent-mode
noindex: true
---

# GitHub Copilot Agent Mode

## Introdução

O GitHub Copilot evoluiu de um assistente de autocompletar código para um agente capaz de executar tarefas de desenvolvimento de forma autônoma. O Agent Mode representa essa evolução, permitindo que o Copilot itere sobre seu próprio código, reconheça erros e os corrija automaticamente.

Esta aula é importante porque demonstra na prática como agentes autônomos funcionam em um ambiente de desenvolvimento real. O Copilot Agent Mode está disponível diretamente no VS Code, tornando-o acessível para qualquer desenvolvedor com uma assinatura do Copilot.

## Definição

O Agent Mode do GitHub Copilot é uma funcionalidade que transforma o assistente de código em um agente autônomo. Neste modo, o Copilot não apenas sugere código, mas pode executar uma sequência de ações para completar uma tarefa complexa, incluindo criar arquivos, executar comandos no terminal e corrigir erros automaticamente.

Diferente do modo tradicional de edição, onde você especifica quais arquivos editar e o Copilot sugere mudanças, no Agent Mode o Copilot infere quais arquivos precisam ser criados ou modificados e executa as ações necessárias para completar sua solicitação.

## Explicação Técnica

### Conceitos-Chave

O GitHub Copilot oferece diferentes modos de interação que evoluíram ao longo do tempo:

**Code Completions**: O modo original onde o Copilot sugere código enquanto você digita. Funciona como um autocompletar inteligente baseado no contexto do arquivo atual.

**Chat**: Interface conversacional onde você pode fazer perguntas sobre código, pedir explicações ou solicitar sugestões. O Copilot responde mas não modifica arquivos diretamente.

**Copilot Edits**: Modo onde você especifica um conjunto de arquivos e pede modificações em linguagem natural. O Copilot sugere mudanças inline que você pode aceitar ou rejeitar.

**Agent Mode**: O modo mais avançado onde o Copilot opera autonomamente. Ele pode criar arquivos, executar comandos, analisar erros e iterar até completar a tarefa.

### Funcionamento e Detalhes Internos

No Agent Mode, o Copilot executa um ciclo de ação-observação-ação:

1. Você fornece um prompt descrevendo o que deseja construir
2. O Copilot planeja as subtarefas necessárias
3. Para cada subtarefa, o Copilot executa ações (criar arquivo, editar código, executar comando)
4. O Copilot observa o resultado (saída do terminal, erros de compilação)
5. Com base no resultado, o Copilot decide o próximo passo
6. O ciclo continua até a tarefa ser concluída

Uma característica importante é a capacidade de self-healing: quando o código gerado produz erros, o Copilot analisa a mensagem de erro e tenta corrigir automaticamente, sem que você precise copiar e colar o erro de volta no chat.

O Agent Mode utiliza uma arquitetura dual-model:
- Um modelo de linguagem principal (GPT-4o, Claude 3.5 Sonnet, Gemini 2.0 Flash, entre outros) considera o contexto completo da sessão
- Um endpoint de decodificação especulativa otimizado para aplicação rápida de mudanças nos arquivos

### Dicas e Cuidados

Para obter melhores resultados com o Agent Mode:

Seja específico no prompt inicial: descreva claramente o que você quer construir, incluindo tecnologias, estrutura de arquivos e comportamento esperado.

Mantenha o contexto gerenciável: o Agent Mode funciona melhor com tarefas bem definidas. Tarefas muito amplas podem resultar em resultados imprevisíveis.

Revise as mudanças: mesmo no modo agente, você continua no controle. Revise as mudanças propostas antes de aceitar, especialmente para comandos de terminal.

Use voz quando possível: a interação por voz torna o fluxo mais natural e conversacional, similar a programação em par com um colega.

### Como Ativar o Agent Mode

Para utilizar o Agent Mode no VS Code:

1. Instale a versão mais recente do VS Code (ou VS Code Insiders para funcionalidades experimentais)
2. Instale a extensão GitHub Copilot Chat
3. Abra o painel Copilot Edits
4. Ao lado do seletor de modelo, mude de "Edit" para "Agent"

## Conclusão

O GitHub Copilot Agent Mode transforma a experiência de desenvolvimento ao permitir que você descreva o que quer construir e deixe o Copilot executar as ações necessárias. Isso não substitui o desenvolvedor, mas permite focar em decisões de arquitetura e lógica de negócio enquanto tarefas repetitivas são automatizadas.

A IA não está substituindo o desenvolvedor. Em vez disso, ela está sempre ao seu lado, como um bom co-piloto.