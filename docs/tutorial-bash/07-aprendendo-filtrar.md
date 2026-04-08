---
sidebar_position: 7
title: "Como Usar grep e find no Linux para Filtrar Arquivos e Logs (DevOps)"
description: "Aprenda a buscar textos e arquivos com grep e find em cenários reais de terminal. Domine filtros, buscas recursivas e combinações úteis para automação."
keywords:
  - "grep"
  - "find"
  - "linux"
  - "devops"
  - "tutorial pt-br"
  - "automação"
  - "filtro de logs"
---

# Lab de Bash Básico: Desmistificando o Terminal - Parte 3

👉 Veja meu curso da Udemy: [Curso DevOps na Prática](https://devopsautomation.com.br/go/udemy-cupom)

## Introdução

Neste laboratório, você vai aprender a encontrar arquivos e conteúdo no seu sistema Linux usando duas ferramentas essenciais de linha de comando: `grep` e `find`.

Vamos montar um ambiente de teste com alguns arquivos e pastas para praticar cada comando na prática.

---

## O que são grep, locate e find

* **`grep`**: Busca texto dentro de arquivos.
* **`find`**: Busca arquivos com base em critérios como nome, tipo, data, etc.

---

## Preparação do Ambiente

Crie o seguinte ambiente para testar os comandos:

```bash
mkdir -p ~/lab_busca/projetos/web ~/lab_busca/relatorios
cd ~/lab_busca

echo "INFO: Sistema iniciado com sucesso." > projetos/log_sistema.log
echo "ATENCAO: Espaço em disco está baixo." >> projetos/log_sistema.log
echo "ERRO: Falha ao conectar no banco de dados." >> projetos/log_sistema.log
echo "Info: Backup do servidor web concluído." > projetos/web/backup.log

echo "<html><head><title>Meu Site</title></head></html>" > projetos/web/index.html
echo "const user = 'admin';" > projetos/web/app.js
echo "Relatório de Vendas - Janeiro 2025" > relatorios/vendas_jan.txt
echo "Relatorio de Vendas - Fevereiro 2025" > relatorios/vendas_fev.TXT
touch relatorios/rascunho.md

cd ~/lab_busca
echo "Ambiente pronto! Vamos começar."
```

---

## Parte 1: grep - Buscando Conteúdo em Arquivos

### 1.1 Buscando uma palavra

```bash
grep "ERRO" projetos/log_sistema.log
```

### 1.2 Busca sem diferenciar maiúsculas/minúsculas

```bash
grep "relatorio" relatorios/vendas_fev.TXT
grep -i "relatorio" relatorios/vendas_fev.TXT
```

### 1.3 Filtrando a saída de comandos com pipe

```bash
ls relatorios/ | grep ".txt"
```

### 1.4 Busca recursiva

```bash
grep -r "Vendas" relatorios/
```

---

## Parte 2: find - Buscando Arquivos com Critérios

### 2.1 Encontrando por nome

```bash
find . -name "index.html"
```

### 2.2 Usando curingas

```bash
find . -name "*.log"
```

### 2.3 Filtrando por tipo

```bash
find projetos/ -type d  # Apenas diretórios
find projetos/ -type f  # Apenas arquivos
```

### 2.4 Combinando com -exec

```bash
find . -name "*.TXT" -exec ls -l {} \;
```

---

## Exemplo Final: Combinando grep e find

**Desafio:** Encontre todos os arquivos `.log` na pasta `projetos` que contenham a palavra "ATENCAO" (ignorando maiúsculas/minúsculas).

```bash
find projetos/ -name "*.log" -exec grep -i "ATENCAO" {} \;
```

---

## Output Esperado (exemplos)

```bash
projetos/log_sistema.log:ATENCAO: Espaço em disco está baixo.
./projetos/web/backup.log
./projetos/web/index.html
-rw-rw-r-- 1 user user 36 Jul  4 10:00 ./relatorios/vendas_fev.TXT
```

---

## Melhores Práticas

* Use `grep -i` para buscas mais flexíveis.
* Prefira `find` para buscas mais completas e personalizadas.
* Sempre teste comandos `find` com `-print` antes de usar `-exec` para evitar erros.
* Combine ferramentas para obter resultados mais poderosos.

---

Com essas ferramentas, você tem total controle para encontrar qualquer arquivo ou informação no seu sistema. Pratique e experimente variações!
