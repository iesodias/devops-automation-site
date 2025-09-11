---
id: instalando-gemini-cli
title: Instalando Gemini CLI
slug: /instalando-gemini-cli
noindex: true
---

# Instalando o Gemini CLI

## Introdução

O **Gemini CLI** é uma ferramenta de linha de comando desenvolvida pelo Google que permite interagir com os modelos Gemini diretamente do terminal. Esta ferramenta é essencial para profissionais DevOps que desejam automatizar tarefas, analisar logs, gerar scripts e integrar IA em seus fluxos de trabalho.

Nesta aula, você aprenderá como instalar e configurar o Gemini CLI em seu sistema, garantindo que tenha todas as dependências necessárias para começar a usar esta poderosa ferramenta.

## Por que usar o Gemini CLI?

- **Automação**: Integre IA diretamente em scripts bash/shell
- **Produtividade**: Execute comandos de IA sem sair do terminal
- **Flexibilidade**: Use em pipelines CI/CD e automações DevOps
- **Rapidez**: Respostas instantâneas sem interface gráfica

## Pré-requisitos

Antes de instalar o Gemini CLI, você precisa ter:

- **Sistema Operacional**: Linux, macOS ou Windows (com WSL)
- **Node.js**: Versão 20 ou superior
- **npm**: Gerenciador de pacotes do Node.js
- **Terminal/Shell**: Bash, Zsh ou similar
- **Conexão com Internet**: Para download e instalação

## Instalação

### Passo 1 — Conferir sua versão atual

Primeiro, vamos verificar se você já tem Node.js instalado e qual versão:

```bash
node -v
npm -v
which node
```

**⚠️ Importante**: Se a versão do Node.js for menor que 20, você precisa atualizá-lo antes de continuar.

### Passo 2 — Instalar Node.js LTS com NVM (recomendado)

O **NVM (Node Version Manager)** é a forma mais segura de instalar e gerenciar versões do Node.js:

```bash
# Instalar NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# Carregar o NVM na sessão atual
source ~/.bashrc  # Para bash
# ou
source ~/.zshrc   # Para zsh

# Instalar e usar a versão LTS (Node 22 no momento)
nvm install --lts
nvm use --lts

# Conferir se a instalação foi bem-sucedida
node -v
npm -v
which node
```

**💡 Dica**: A própria página do pacote no npm e o repositório no GitHub recomendam Node.js 20+. Usando o NVM, você garante a versão correta sem conflitos com o gerenciador de pacotes do sistema.

### Passo 3 — Instalar o Gemini CLI

Com o Node.js atualizado, agora podemos instalar o Gemini CLI:

```bash
# Se você já tinha uma versão anterior instalada, remova primeiro
npm uninstall -g @google/gemini-cli

# Limpar cache do PATH do shell
hash -r

# Instalar a versão mais recente do Gemini CLI
npm install -g @google/gemini-cli
```

### Passo 4 — Verificar a instalação

Para confirmar que o Gemini CLI foi instalado corretamente:

```bash
# Verificar se o comando está disponível
which gemini

# Ver a versão instalada
gemini --version

# Ver ajuda básica
gemini --help
```

## Próximos passos

Com o Gemini CLI instalado, você está pronto para:

1. **Configurar sua API Key** do Google AI Studio
2. **Executar seus primeiros prompts** via linha de comando
3. **Integrar o Gemini** em seus scripts de automação
4. **Explorar recursos avançados** como contexto e configurações personalizadas

Na próxima aula, aprenderemos sobre prompts específicos e como usar efetivamente o Gemini CLI em cenários DevOps reais.