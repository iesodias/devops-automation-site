---
slug: kit-aliases-kubernetes-troubleshooting
title: "Kit de Aliases para Troubleshooting em Kubernetes: Copie, Cole e Ganhe Velocidade"
description: "Use este kit de aliases e funções para acelerar troubleshooting em Kubernetes com foco em pods, logs, eventos, contextos e namespaces."
authors: [Ieso]
tags:
  - "terminal"
  - "kubernetes produção"
  - "automação com bash"
  - "produtividade"
  - "curso devops"
keywords: [aliases kubernetes, troubleshooting kubernetes, kubectl, k8s, logs kubernetes, eventos kubernetes, produtividade terminal]
date: 2026-05-30
---

# Kit de Aliases para Troubleshooting em Kubernetes: Copie, Cole e Ganhe Velocidade

<!-- truncate -->

## Introdução

No post anterior, vimos como aliases simples já mudam o jogo no terminal.

Agora vamos para o próximo nível: um kit completo, focado em troubleshooting de Kubernetes, pronto para colar no seu shell.

A ideia aqui não é "ter mil atalhos". É ter os atalhos certos para os momentos de pressão:

- pod caiu e você precisa de log rápido
- deploy travou e você precisa de evento
- contexto errado e risco de mexer no cluster errado
- namespace trocado e comandos retornando vazio

## Objetivo do kit

Este kit resolve 80% do dia a dia de investigação:

1. navegar entre contexto e namespace com segurança
2. listar recursos importantes com menos digitação
3. pegar logs, descrever recursos e ver eventos rapidamente
4. reduzir erro humano em ambiente de produção

## Base obrigatoria: k + autocomplete

Antes de tudo, garanta o básico:

```bash
alias k='kubectl'
```

E autocomplete para o alias.

### Bash

```bash
source <(kubectl completion bash)
alias k='kubectl'
complete -o default -F __start_kubectl k
```

### Zsh

```bash
source <(kubectl completion zsh)
alias k='kubectl'
complete -o default -F __start_kubectl k
```

## Kit pronto para copiar e colar

Cole o bloco abaixo no seu `~/.zshrc` ou `~/.bashrc`.

```bash
# ---------- Kubernetes alias kit ----------
alias k='kubectl'

# Listagens mais usadas
alias kgp='k get pods'
alias kgs='k get svc'
alias kgd='k get deploy'
alias kgn='k get nodes'
alias kgi='k get ingress'
alias kgc='k get configmap'
alias kgsa='k get sa'

# Visão ampla para triagem
alias kgpa='k get pods -A'
alias kgda='k get deploy -A'
alias kgsa='k get svc -A'
alias kgea='k get events -A --sort-by=.metadata.creationTimestamp'

# Describe rápido
alias kdp='k describe pod'
alias kdd='k describe deploy'
alias kds='k describe svc'
alias kde='k describe events'

# Logs
alias kl='k logs'
alias klf='k logs -f'
alias klp='k logs --previous'

# Aplicação
alias kaf='k apply -f'
alias kdf='k delete -f'

# Recursos de rollout
alias krs='k rollout status deploy'
alias kru='k rollout undo deploy'
alias krh='k rollout history deploy'

# Contexto e namespace
alias kctx='k config current-context'
alias kctxs='k config get-contexts'

kc() {
  k config use-context "$1"
}

kn() {
  k config set-context --current --namespace "$1"
}

knc() {
  k config view --minify --output 'jsonpath={..namespace}'
  echo
}

# Exec e debug básico
ksh() {
  k exec -it "$1" -- /bin/sh
}

kbash() {
  k exec -it "$1" -- /bin/bash
}

# Restart rápido de deployment
krd() {
  k rollout restart deploy "$1"
}

# Watch útil para incidentes
kwp() {
  k get pods -w
}

# ---------- end kit ----------
```

Depois recarregue o shell:

```bash
source ~/.zshrc
```

ou:

```bash
source ~/.bashrc
```

## Sequências práticas de troubleshooting

Aqui estão fluxos curtos que uso em incidente.

### 1. Pod com erro

```bash
kgp
kdp meu-pod
kl meu-pod
klp meu-pod
```

### 2. Deploy não sobe

```bash
kgd
kdd meu-deploy
krs meu-deploy
kgea | tail -n 30
```

### 3. Serviço sem tráfego

```bash
kgs
kds meu-servico
kgp -l app=minha-app
```

### 4. Erro clássico de contexto/namespace

```bash
kctx
knc
kctxs
kc meu-contexto
kn meu-namespace
```

## Regras de segurança para evitar acidente

Atalho bom e atalho seguro. Mantenha estas regras:

1. Nunca esconda comandos destrutivos atrás de aliases curtos.
2. Sempre confira contexto e namespace antes de `apply` ou `delete`.
3. Evite alias que mudam comportamento padrão de forma silenciosa.
4. Documente o kit em um arquivo compartilhado do time.
5. Revise aliases mensalmente e remova o que não usa.

## Versão para times: padronize em um arquivo único

Para escalar isso no time, coloque o kit em um arquivo como `~/.k8s_aliases` e carregue no shell:

```bash
echo "source ~/.k8s_aliases" >> ~/.zshrc
```

Assim todo mundo usa a mesma base e onboarding fica muito mais rápido.

## Conexão com curso e automação

No meu curso de DevOps na Udemy, eu bato muito nessa tecla: produtividade real vem de padronização e automação incremental.

Um kit de aliases como este parece detalhe, mas em operação diária vira vantagem competitiva: menos atrito, menos erro, mais foco no que importa.

## Conclusão

Se você quer operar Kubernetes com mais velocidade, começar por aliases e funções utilitárias é um dos atalhos mais eficientes que existem.

Copie o kit, ajuste para seu contexto e evolua com base nos incidentes reais que você enfrenta.

No próximo post, posso trazer uma versão "produção" com prompt inteligente mostrando contexto e namespace no terminal para reduzir risco de comando no cluster errado.
