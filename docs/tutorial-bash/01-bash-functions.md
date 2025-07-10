---
sidebar_position: 1
---

# Entendendo Funções no Bash

👉 Veja meu curso da Udemy: [Curso DevOps na Prática](https://devopsautomation.com.br/go/udemy-cupom)

## Pré-requisitos:
- Você deve ter um sistema Linux ou um terminal com Bash instalado.

## Etapa 1: Criar um diretório para o laboratório

Crie um diretório dedicado para o lab e navegue até ele:

```bash
mkdir bash-functions-lab
cd bash-functions-lab
```

## Etapa 2: Criar uma função básica

Crie um arquivo chamado `my_functions.sh`:

```bash
touch my_functions.sh
```

Abra o arquivo `my_functions.sh` e adicione uma função básica:

```bash
vi my_functions.sh
```

Escreva a seguinte função:

```bash
hello_mdc() {
    echo "Olá, Universidade MDC!"
}
```

## Etapa 3: Carregar o arquivo de funções

Use o comando `source` para carregar o arquivo com as funções na sua sessão atual:

```bash
source my_functions.sh
```

## Etapa 4: Executar a função

Execute a função `hello_mdc`:

```bash
hello_mdc
```

## Etapa 5: Criar uma função com parâmetros

Edite o arquivo `my_functions.sh` para adicionar uma função que aceita parâmetros:

```bash
vi my_functions.sh
```

Adicione a seguinte função:

```bash
greet_person() {
    echo "Olá, $1!"
}
```

Carregue o arquivo novamente:

```bash
source my_functions.sh
```

Execute a função passando um parâmetro:

```bash
greet_person "Alice"
```

## Etapa 6: Implementar uma opção de ajuda

Modifique a função `greet_person` para incluir uma opção de ajuda caso nenhum parâmetro seja passado:

```bash
greet_person() {
    if [ $# -eq 0 ]; then
        echo "Uso: greet_person [nome]"
        return 1
    fi
    echo "Olá, $1!"
}
```

Carregue e teste o comportamento:

```bash
source my_functions.sh
greet_person
```

<!-- truncate -->