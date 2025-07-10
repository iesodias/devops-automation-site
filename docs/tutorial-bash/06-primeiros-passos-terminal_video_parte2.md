---
sidebar_position: 6
---

# Lab de Bash Básico: Desmistificando o Terminal - Parte 2

👉 Veja meu curso da Udemy: [Curso DevOps na Prática](https://devopsautomation.com.br/go/udemy-cupom)

## Passo 1: Abrindo o Terminal e Entendendo o Prompt

Primeiro, abra o seu terminal.

  * **No Linux:** Use o atalho `Ctrl + Alt + T` ou procure por "Terminal".
  * **No macOS:** Procure por "Terminal" no Spotlight (`Cmd + Espaço`).
  * **No Windows:** Utilize o **WSL (Windows Subsystem for Linux)** ou **Git Bash**.

Você será recebido pelo **prompt de comando**:

```bash
seu_usuario@nome_do_computador:~$
```

Ele está pronto para receber seus comandos. O til (`~`) é um atalho para o seu diretório "home", seu ponto de partida no sistema.

## Passo 2: Onde Estou? O Comando `pwd`

No terminal, a primeira coisa é saber se localizar. Para descobrir o caminho completo da pasta onde você está, use o comando `pwd` (Print Working Directory).

```bash
pwd
```

A saída será o caminho absoluto do seu diretório, como `/home/seu_usuario`.

## Passo 3: O Que Tem Aqui? Listando com `ls`

Ok, já sabemos *onde* estamos. Agora, o que existe *dentro* deste local? Para listar os arquivos e pastas, usamos o comando `ls` (List).

```bash
ls
```

> **Dica de Pro:** Turbine o `ls` com "flags" (opções) para ver mais detalhes:
>
>   * `ls -l`: Mostra uma lista "longa" e detalhada (permissões, dono, tamanho, data).
>   * `ls -a`: Mostra *todos* os arquivos, incluindo os arquivos de configuração ocultos (que começam com `.`).

Combine as flags para uma visão completa: `ls -la`.

## Passo 4: Criando o Diretório do Projeto com `mkdir`

Todo bom projeto começa com uma boa organização. Vamos criar um diretório (pasta) para nosso laboratório com o comando `mkdir` (Make Directory).

```bash
mkdir lab-devops-bash
```

Use `ls` e veja que a pasta `lab-devops-bash` agora existe.

## Passo 5: Entrando no Projeto com `cd`

Vamos entrar no nosso novo diretório de projeto com o comando `cd` (Change Directory).

```bash
cd lab-devops-bash
```

Perceba que o seu prompt de comando deve ter mudado para indicar que você está dentro da nova pasta. Use `pwd` para confirmar sua nova localização.

**Como sair?** Para voltar ao diretório anterior (o diretório "pai"), use `cd ..`.

> **Dica de Pro:** O comando `cd` (sem nenhum argumento) é um atalho universal para voltar instantaneamente ao seu diretório "home" (`~`), não importa onde você esteja.

## Passo 6: Criando um Script de Automação com `echo`

Vamos voltar para nossa pasta de trabalho (`cd lab-devops-bash`) e criar nosso primeiro "script de automação". Em vez de um arquivo vazio, vamos criá-lo já com uma linha de comando dentro, usando `echo` e o redirecionador `>`.

```bash
echo "echo 'Pipeline iniciado com sucesso!'" > run-pipeline.sh
```

Analisando o comando:

  * `echo "..."`: Gera o texto `echo 'Pipeline iniciado com sucesso!'`.
  * `>`: Pega esse texto e o "redireciona" (joga) para dentro do arquivo `run-pipeline.sh`. Ele cria o arquivo se não existir. **Atenção:** Se o arquivo já existir, o `>` **sobrescreve todo o conteúdo**\!

## Passo 7: Verificando o Script com `cat`

Para visualizar o conteúdo do nosso script diretamente no terminal, sem precisar abrir um editor, usamos o `cat` (Concatenate).

```bash
cat run-pipeline.sh
```

O terminal exibirá o conteúdo do arquivo: `echo 'Pipeline iniciado com sucesso!'`.

## Passo 8: Criando uma Cópia de Segurança com `cp`

Antes de mover um script para "produção", é uma boa prática criar uma cópia de segurança. Faremos isso com o comando `cp` (Copy).

A sintaxe é `cp [arquivo_fonte] [arquivo_destino]`.

```bash
cp run-pipeline.sh run-pipeline.sh.bak
```

Use `ls -l`. Agora você tem o script original e uma cópia de backup com a extensão `.bak`, uma convenção muito comum.

## Passo 9: Movendo o Script para "Deploy" com `mv`

Nosso script está pronto para ser "implantado" (deploy). Vamos criar um diretório chamado `deploy` e mover a versão final do script para lá. O comando `mv` (Move) faz exatamente isso.

Primeiro, crie o diretório de destino:

```bash
mkdir deploy
```

Agora, mova o script original (não o backup\!) para dentro da pasta `deploy`:

```bash
mv run-pipeline.sh deploy/
```

Verifique o resultado\!

  * Use `ls` na pasta atual. O arquivo `run-pipeline.sh` não está mais aqui.
  * Use `ls deploy`. O arquivo está lá dentro\!

## Recapitulação e Desafio DevOps\!

Excelente trabalho\! Você concluiu um ciclo básico de gerenciamento de arquivos como um profissional de DevOps\!

**Comandos que você dominou hoje:**

  * `pwd`: Onde estou?
  * `ls`: O que tem aqui?
  * `mkdir`: Criar diretório.
  * `cd`: Navegar entre diretórios.
  * `echo >`: Criar arquivos com conteúdo.
  * `cat`: Visualizar conteúdo.
  * `cp`: Copiar arquivos.
  * `mv`: Mover (e renomear) arquivos.

**Seu Desafio:**
Todo projeto tem uma pasta para o código-fonte em desenvolvimento. Dentro do seu diretório `lab-devops-bash`, crie uma pasta chamada `src` (abreviação padrão de "source"). Em seguida, mova o seu backup (`run-pipeline.sh.bak`) para dentro da pasta `src` e, no mesmo comando, renomeie-o para `pipeline-dev-v1.sh`.

Conseguiu? Comente no vídeo como você fez\!

No próximo laboratório vamos explorar como remover arquivos com segurança, como usar coringas (`*`) para manipular múltiplos arquivos de uma vez e como obter ajuda sobre qualquer comando.

Até a próxima\!