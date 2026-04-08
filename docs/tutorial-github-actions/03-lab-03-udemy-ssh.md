---
sidebar_position: 3
title: "Como Configurar Chave SSH no GitHub com Segurança (Passo a Passo)"
description: "Aprenda a gerar, copiar e cadastrar uma nova chave SSH no GitHub para autenticação segura. Siga o guia completo para Linux, macOS e Windows."
keywords:
  - "github ssh"
  - "chave ssh"
  - "git e github"
  - "devops"
  - "tutorial pt-br"
  - "automação"
---

# Tutorial Completo: Configurando uma Nova Chave SSH para o GitHub

👉 Veja meu curso da Udemy: [Curso DevOps na Prática](https://devopsautomation.com.br/go/udemy-cupom)

Configurar uma chave SSH (Secure Shell) para o GitHub é crucial para uma autenticação **segura** e **sem senhas repetitivas**. Em vez de digitar suas credenciais a cada interação, você usará um par de chaves criptográficas: uma **chave privada** (que fica segura no seu computador) e uma **chave pública** (que você adiciona ao GitHub).

Este tutorial irá te guiar passo a passo para gerar uma **nova chave pública** e configurá-la no seu GitHub.

-----

### Passo 1: Verificar e Preparar o Ambiente

Primeiro, vamos garantir que você está pronto para gerar a nova chave.

1.  **Abra seu Terminal:**

      * **Linux/macOS:** Procure por "Terminal" no seu sistema (atalho comum: `Ctrl + Alt + T` no Linux).
      * **Windows:** Use o **Git Bash** (instalado com o Git). Ele fornece um ambiente Linux-like para comandos SSH.

2.  **Verifique Chaves SSH Existentes (Opcional, mas recomendado):**
    É bom saber se você já possui chaves configuradas. Digite:

    ```bash
    ls -al ~/.ssh
    ```

      * **Se você vir arquivos** como `id_rsa.pub`, `id_ecdsa.pub` ou `id_ed25519.pub` (e seus correspondentes sem `.pub`), você já tem chaves.
      * **Se não vir esses arquivos** ou o diretório `.ssh` não existir, não se preocupe, vamos criar a chave do zero.

-----

### Passo 2: Gerar a Nova Chave SSH

Vamos criar um par de chaves SSH usando o algoritmo **Ed25519**, que é o recomendado atualmente pelo GitHub por ser seguro e eficiente.

1.  **Execute o Comando de Geração de Chave:**
    Digite o seguinte comando no seu terminal, **substituindo `"seu_email@exemplo.com"` pelo seu endereço de e-mail do GitHub**. Este e-mail serve apenas para identificar a chave.

    ```bash
    ssh-keygen -t ed25519 -C "seu_email@exemplo.com"
    ```

2.  **Escolha o Local para Salvar a Chave:**
    Você verá uma pergunta como:

    ```
    Enter file in which to save the key (/Users/seu_usuario/.ssh/id_ed25519):
    ```

      * **Para criar uma CHAVE NOVA e evitar sobrescrever uma existente:**
        É **fortemente recomendado** que você digite um **nome de arquivo diferente** aqui. Por exemplo, para o GitHub, você pode usar:

        ```
        /Users/seu_usuario/.ssh/id_github_ed25519
        ```

        Ou simplesmente:

        ```
        id_github_ed25519
        ```

        (ele completará o caminho `~/.ssh/`). **Pressione `Enter`** após digitar o novo nome.

      * **Se você deseja MESMO SOBRESCREVER uma chave existente (`id_ed25519`):**
        Você pode pressionar `Enter` para aceitar o nome padrão. O sistema perguntará se você quer sobrescrever (`Overwrite (y/n)?`). Digite `y` e `Enter`. **Cuidado:** Isso apagará a chave antiga e poderá quebrar acessos configurados com ela.

3.  **Crie uma Passphrase (Senha):**
    O terminal pedirá para você definir uma passphrase:

    ```
    Enter passphrase (empty for no passphrase):
    Enter same passphrase again:
    ```

      * **Recomendado:** **Crie uma passphrase forte.** Essa senha adiciona uma camada extra de segurança à sua chave privada. Você a digitará cada vez que usar a chave (a menos que use um agente SSH, como veremos no próximo passo).
      * **Não recomendado:** Pressione `Enter` duas vezes para deixar a passphrase vazia. Sua chave não terá proteção extra.

    Após esses passos, seu par de chaves SSH será gerado no diretório `~/.ssh/`. Você terá dois arquivos: `id_github_ed25519` (sua **chave privada**, mantenha-a segura\!) e `id_github_ed25519.pub` (sua **chave pública**).

-----

### Passo 2: Copiar a Chave Pública

Agora precisamos copiar o conteúdo da sua chave pública para adicioná-lo ao GitHub.

1.  **Para Linux:**
    (Instale `xclip` se não tiver: `sudo apt-get install xclip`)

    ```bash
    xclip -selection clipboard < ~/.ssh/id_github_ed25519.pub
    ```

    **Alternativa (copiar manualmente):**

    ```bash
    cat ~/.ssh/id_github_ed25519.pub
    ```

    Selecione e copie **TODO o texto** que aparecer na tela, que começa com `ssh-ed25519` e termina com o seu e-mail.

2.  **Para macOS:**

    ```bash
    pbcopy < ~/.ssh/id_github_ed25519.pub
    ```

3.  **Para Windows (usando Git Bash):**

    ```bash
    clip < ~/.ssh/id_github_ed25519.pub
    ```

    Após executar o comando apropriado, o conteúdo da sua chave pública estará na sua área de transferência (clipboard).

-----

### Passo 3: Adicionar a Chave Pública ao GitHub

Com a chave pública copiada, é hora de adicioná-la à sua conta do GitHub.

1.  **Acesse as Configurações do GitHub:**

      * Faça login no GitHub em seu navegador.
      * Clique na sua **foto de perfil** (canto superior direito).
      * Selecione **"Settings"** (Configurações).

2.  **Navegue até "SSH and GPG keys":**

      * No menu lateral esquerdo, clique em **"SSH and GPG keys"**.

3.  **Adicione uma Nova Chave SSH:**

      * Clique no botão verde **"New SSH key"** ou **"Add SSH key"**.

4.  **Cole a Chave Pública:**

      * No campo **"Title"** (Título), dê um nome descritivo para sua chave (ex: "Meu Laptop - GitHub", "Chave do Desktop").
      * No campo **"Key"** (Chave), **cole o conteúdo da sua chave pública** que você copiou no Passo 4. Certifique-se de colar todo o texto, sem espaços extras.
      * Clique em **"Add SSH key"**.
      * Pode ser que o GitHub peça para você confirmar sua senha do GitHub para finalizar a adição da chave.

-----

### Próximos Passos: Usando SSH com Repositórios

A partir de agora, ao interagir com repositórios no GitHub (clonar, fazer push, pull, etc.), você pode usar o **protocolo SSH** em vez de HTTPS.

  * **Para clonar um repositório via SSH:**
      * No GitHub, ao visitar um repositório, clique no botão verde **"Code"** (Código).
      * Selecione a opção **"SSH"** e copie o URL (que começará com `git@github.com:`).
      * Exemplo: `git clone git@github.com:seu_usuario/seu_repositorio.git`

Parabéns\! Sua nova chave SSH está configurada, e você está pronto para uma experiência de desenvolvimento mais segura e eficiente com o GitHub.
