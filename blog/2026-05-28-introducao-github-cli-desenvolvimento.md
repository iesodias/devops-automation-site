---
slug: introducao-github-copilot-cli-desenvolvimento
title: "Introdução ao GitHub Copilot CLI: Instalação, Login e Primeiros Comandos"
description: "Aprenda a instalar e usar o GitHub Copilot CLI no VS Code e no terminal, com passo a passo para macOS, Windows e Linux."
authors: [Ieso]
tags:
  - "github copilot"
  - "coding agent"
  - "cli tools para desenvolvedores"
  - "produtividade com ia no terminal"
  - "devops para desenvolvedores"
keywords: [github copilot cli, instalar copilot cli, copilot login, copilot no vscode, copilot terminal, ai para desenvolvimento, produtividade no terminal]
date: 2026-05-28
---

# Introdução ao GitHub Copilot CLI: Instalação, Login e Primeiros Comandos

Se você quer usar IA direto no terminal para acelerar tarefas de desenvolvimento, o GitHub Copilot CLI é uma das opções mais práticas hoje.

Neste guia, você vai aprender o que é o Copilot CLI, como instalar, como fazer login e como começar com comandos essenciais.

<!-- truncate -->

## O que é o GitHub Copilot CLI

O GitHub Copilot CLI é a interface de linha de comando do Copilot para executar sessões com agente, trabalhar com contexto do projeto e automatizar partes do fluxo de desenvolvimento sem sair do terminal.

Ele funciona muito bem para tarefas como:

- explorar e entender código rapidamente
- propor mudanças com contexto local
- executar ações com aprovação controlada
- manter sessões de trabalho no terminal e no VS Code

## Importante: VS Code vs instalação manual

Pelo guia da Microsoft, quando você usa sessões de Copilot CLI dentro do VS Code, o editor instala e configura o Copilot CLI automaticamente.

Ou seja:

- No VS Code: normalmente não precisa instalar manualmente para usar sessões de Copilot CLI.
- Fora do VS Code (terminal do sistema): você pode instalar manualmente e usar o comando copilot diretamente.

Referências usadas neste artigo:

- Microsoft (VS Code): https://code.visualstudio.com/docs/copilot/agents/copilot-cli
- GitHub Docs (referência de comandos): https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference
- Context7 + repositório oficial do Copilot CLI: https://github.com/github/copilot-cli

## Passo a passo para instalar o GitHub Copilot CLI

### 1) macOS e Linux (Homebrew)

```bash
brew install copilot-cli
```

### 2) macOS e Linux (script oficial)

```bash
curl -fsSL https://gh.io/copilot-install | bash
```

Alternativa com wget:

```bash
wget -qO- https://gh.io/copilot-install | bash
```

### 3) Windows (WinGet)

```powershell
winget install GitHub.Copilot
```

### 4) Alternativa multiplataforma com npm

```bash
npm install -g @github/copilot
```

## Primeiro acesso: login e execução

Depois da instalação, faça login:

```bash
copilot login
```

Segundo a referência oficial:

- o login padrão usa fluxo web (navegador)
- o token fica no credential store do sistema quando disponível
- para automação/headless, você pode usar token via ambiente (COPILOT_GITHUB_TOKEN, GH_TOKEN ou GITHUB_TOKEN)

Para iniciar a interface interativa:

```bash
copilot
```

## Comandos iniciais que você deve conhecer

```bash
# Abre a ajuda geral
copilot help

# Mostra versão instalada
copilot version

# Atualiza para a versão mais recente
copilot update

# Inicia com prompt interativo direto
copilot --interactive "me explique este projeto"
```

No modo interativo, você também pode usar:

- /help para ver comandos de sessão
- /model para trocar modelo
- /init para gerar instruções do repositório
- /resume para continuar sessões anteriores

## Como usar no VS Code sem fricção

Se você já trabalha com Chat do VS Code:

1. Abra o Chat e selecione Copilot CLI como Session Target.
2. Escolha Worktree isolation ou Workspace isolation.
3. Envie seu prompt e acompanhe a sessão em background.
4. Se quiser, abra um terminal de perfil GitHub Copilot CLI e continue por lá.

Esse fluxo é ótimo para tarefas de implementação mais longas, porque a sessão pode continuar em background enquanto você segue codando.

## Boas práticas para iniciantes

- Comece com tarefas pequenas e de escopo fechado.
- Revise diffs com frequência antes de aprovar mudanças.
- Use comandos de ajuda (/help e copilot help) para ganhar velocidade.
- Em ambiente corporativo, defina regras de permissões e aprovação antes de escalar uso.

## FAQ rápido

### Preciso do GitHub CLI (gh) para usar o Copilot CLI?

Não é obrigatório para iniciar. O Copilot CLI funciona por conta própria. Em alguns cenários, tokens de ambiente como GH_TOKEN podem ser reaproveitados.

### O Copilot CLI funciona no VS Code e no terminal?

Sim. No VS Code, há integração nativa com sessões de Copilot CLI. No terminal, você usa o binário copilot instalado manualmente.

### Posso usar com GitHub Enterprise Cloud?

Sim. O comando copilot login aceita o parâmetro --host para autenticar em host específico.

## Conclusão

Se a sua meta é produtividade com IA no terminal, o GitHub Copilot CLI é um excelente ponto de entrada.

Comece com instalação simples, faça login, rode os primeiros comandos e evolua para sessões mais avançadas no VS Code. Esse caminho já entrega ganho real no fluxo de desenvolvimento sem aumentar complexidade no início.
