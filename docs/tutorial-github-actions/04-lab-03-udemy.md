---
sidebar_position: 4
title: "GitHub Actions para Iniciantes: Primeiro Workflow e Jobs com Dependências"
description: "Crie seu primeiro pipeline no GitHub Actions e evolua para múltiplos jobs com dependências. Aprenda CI/CD na prática com YAML e automação no GitHub."
keywords:
  - "github actions"
  - "ci cd"
  - "workflow yaml"
  - "devops"
  - "tutorial pt-br"
  - "automação"
---

# Lab de GitHub Actions: Primeiros Passos em Automação CI/CD

👉 Veja meu curso da Udemy: [Curso DevOps na Prática](https://devopsautomation.com.br/go/udemy-cupom)

Bem-vindo(a) ao seu laboratório de GitHub Actions\! Aqui você dará os primeiros passos para automatizar tarefas de desenvolvimento e implantação, transformando o "medo do terminal" em domínio da automação.

-----

## Lab-01: Overview do GitHub Actions

O GitHub Actions é uma plataforma de **Integração Contínua (CI)** e **Entrega Contínua (CD)** que permite automatizar o seu fluxo de trabalho de desenvolvimento diretamente no GitHub.

Com ele, você pode:

  * **Construir** e **testar** seu código automaticamente.
  * **Implantar** suas aplicações em diferentes ambientes.
  * **Automatizar** tarefas de rotina, como linting, formatação de código, etc.
  * Tudo isso a partir de arquivos **YAML** configurados no seu repositório.

Pense no GitHub Actions como um "robô" que executa tarefas por você, a cada vez que uma condição que você define é atendida (como um `push` de código ou a abertura de um `Pull Request`).

-----

## Lab-02: Primeiro Workflow

Neste lab, vamos criar nosso primeiro workflow bem simples para entender a estrutura básica de um arquivo YAML de GitHub Actions.

1.  **Crie um Repositório no GitHub:**

      * Vá para o seu GitHub e crie um novo repositório com o nome `mdc-githubactions`. Você pode deixá-lo público ou privado.

2.  **Abra o Repositório no seu Ambiente Local:**

      * Clone o repositório para o seu computador local usando o Git:
        ```bash
        git clone https://github.com/SEU_USUARIO/mdc-githubactions.git
        cd mdc-githubactions
        ```

3.  **Crie o Diretório do Workflow:**

      * Na raiz do seu repositório local, crie a estrutura de diretórios necessária para os workflows. É onde o GitHub Actions espera encontrar seus arquivos de configuração.
        ```bash
        mkdir -p .github/workflows
        ```

4.  **Crie e Edite o Arquivo YAML do Workflow:**

      * Dentro do diretório recém-criado (`.github/workflows/`), crie um arquivo YAML com o nome `mdc-workflow.yml`.

        ```bash
        touch .github/workflows/mdc-workflow.yml
        ```

      * Abra o arquivo `mdc-workflow.yml` em um editor de texto (VS Code, Sublime Text, etc.) e cole o conteúdo abaixo:

        ```yaml
        name: Mdc Workflow

        on:
          push:
            branches:
              - main # Ou 'master', dependendo do nome da sua branch principal

        jobs:
          build:
            runs-on: ubuntu-latest

            steps:
              - name: Checkout do Código
                uses: actions/checkout@v2 # Action para clonar o repositório

              - name: Mostrar Mensagem
                run: echo "Olá, MDC, GitHub Actions!" # Comando a ser executado
        ```

5.  **Entendendo a Estrutura do Workflow:**

      * `name`: **Define o nome do workflow.** Este é um rótulo que aparecerá na interface do GitHub Actions para identificar o workflow (ex: "Mdc Workflow").

      * `on`: **Define quando o workflow será acionado.**

          * `push`: Indica que o evento é um `push` (envio) de código.
          * `branches`: Especifica as branches que devem acionar o workflow. Nesse caso, o workflow será acionado apenas quando houver um `push` na branch `main` (ou `master`, se for o caso do seu repositório).

      * `jobs`: **Define os `jobs` (tarefas) a serem executados no workflow.** Um workflow pode ter um ou vários jobs.

          * `build`: É o nome do seu primeiro (e único, por enquanto) job. Pode ser um nome descritivo (ex: `test`, `deploy`).
          * `runs-on`: Especifica o **sistema operacional** em que o job será executado. Neste caso, o job será executado em uma máquina com sistema operacional Ubuntu (`ubuntu-latest`).

      * `steps`: **Define as etapas a serem executadas dentro de um `job`.** Um job pode ter um ou vários steps, que são executados em sequência.

          * `- name: Checkout do Código`: Define o nome da primeira etapa.
          * `uses: actions/checkout@v2`: Especifica uma **ação pré-construída** que será utilizada na etapa. A `actions/checkout@v2` é uma ação comum que clona o código do seu repositório para o ambiente de execução do workflow.
          * `- name: Mostrar Mensagem`: Define o nome da segunda etapa.
          * `run: echo "Olá, MDC, GitHub Actions!"`: Especifica o **comando ou script** a ser executado na etapa. Neste caso, o comando `echo` é usado para mostrar a mensagem no console de saída do workflow.

6.  **Faça o Commit e Push do Código:**

      * Salve o arquivo `mdc-workflow.yml`.
      * Adicione os arquivos ao Git, faça o commit e envie para o GitHub:
        ```bash
        git add .
        git commit -m "feat: Adiciona primeiro workflow de GitHub Actions"
        git push origin main # Ou 'master'
        ```

7.  **Verifique a Execução no GitHub:**

      * Após o `push`, vá para o seu repositório no GitHub. Clique na aba **"Actions"**.
      * Você verá o seu workflow (`Mdc Workflow`) sendo executado (ou já concluído com sucesso). Clique nele para ver os detalhes, incluindo a saída do comando `echo`.

-----

## Lab-03: Múltiplos Stages (Jobs) e Dependências

Neste lab, vamos expandir nosso workflow para simular um processo de CI/CD mais complexo, com múltiplos "estágios" ou "jobs" que dependem uns dos outros. Isso é fundamental para orquestrar fluxos de trabalho como `build` -\> `deploy-dev` -\> `deploy-qa` -\> `deploy-prod`.

1.  **Edite o Arquivo YAML do Workflow:**

      * Abra novamente o arquivo `.github/workflows/mdc-workflow.yml` no seu editor.

      * **Substitua** todo o conteúdo atual pelo YAML abaixo:

        ```yaml
        name: Mdc Workflow

        on:
          push:
            branches:
              - main # Ou 'master'

        jobs:
          build:
            runs-on: ubuntu-latest
            
            steps:
              - name: Checkout do Código
                uses: actions/checkout@v2

          dev:
            needs: build # Este job SÓ roda depois que 'build' terminar com sucesso
            runs-on: ubuntu-latest

            steps:
              - name: Fase de Desenvolvimento
                run: echo "Executando deploy de DEV"

          qa:
            needs: build # Este job TAMBÉM SÓ roda depois que 'build' terminar com sucesso
            runs-on: ubuntu-latest

            steps:
              - name: Fase de Qualidade
                run: echo "Executando deploy de QA"

          homologacao:
            needs:
              - dev # Este job SÓ roda depois que 'dev' e 'qa' terminarem com sucesso
              - qa
            runs-on: ubuntu-latest

            steps:
              - name: Fase de Homologação
                run: echo "Executando deploy de HML"

          producao:
            needs: homologacao # Este job SÓ roda depois que 'homologacao' terminar com sucesso
            runs-on: ubuntu-latest

            steps:
              - name: Fase de Produção
                run: echo "Executando deploy de PRD"
        ```

2.  **Entendendo as Novidades:**

      * **Múltiplos `jobs`:** Agora temos cinco jobs: `build`, `dev`, `qa`, `homologacao` e `producao`.
      * `needs`: Esta é a palavra-chave mais importante aqui. Ela define as **dependências entre os jobs**.
          * `dev` e `qa` só serão executados *depois* que o job `build` for concluído com sucesso. Eles podem rodar em paralelo entre si, pois ambos dependem apenas de `build`.
          * `homologacao` só será executado *depois* que **ambos** os jobs `dev` e `qa` forem concluídos com sucesso.
          * `producao` só será executado *depois* que o job `homologacao` for concluído com sucesso.

3.  **Faça o Commit e Push do Código Novamente:**

      * Salve o arquivo `mdc-workflow.yml`.
      * Adicione os arquivos ao Git, faça o commit e envie para o GitHub:
        ```bash
        git add .
        git commit -m "feat: Adiciona multiplos stages com dependencias"
        git push origin main # Ou 'master'
        ```

4.  **Verifique a Orquestração no GitHub:**

      * Volte para a aba **"Actions"** no seu repositório do GitHub.
      * Você verá a nova execução do workflow. Clique nela.
      * Observe o **gráfico visual** que o GitHub Actions mostra. Ele ilustra claramente a ordem de execução e as dependências entre os jobs, mostrando como `dev` e `qa` rodam em paralelo após `build`, e como `homologacao` espera por ambos antes de `producao` ser acionado.

-----

Com este lab, você não apenas criou seu primeiro workflow, mas também aprendeu a orquestrar múltiplas tarefas em um fluxo sequencial e paralelo. Isso é a base para construir pipelines de CI/CD robustos\!
