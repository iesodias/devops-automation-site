---
sidebar_position: 2
---

# Criando Resource Groups no Azure com Funções Bash

## Pré-requisitos:
- Azure CLI instalado e configurado no seu sistema.
- Estar logado na sua conta Azure via Azure CLI.

👉 Veja meu curso da Udemy: [Curso DevOps na Prática](https://devopsautomation.com.br/go/udemy-cupom)

## Etapa 1: Criar um diretório para o laboratório

Crie um diretório dedicado para o lab e navegue até ele:

```bash
mkdir azure-resource-group-lab
cd azure-resource-group-lab
```

## Etapa 2: Login no Azure

Garanta que você está logado na sua conta Azure:

```bash
az login
```

## Etapa 3: Criar a função

Crie um arquivo chamado `resource_group_functions.sh`:

```bash
touch resource_group_functions.sh
```

Abra o arquivo `resource_group_functions.sh` e adicione a seguinte função:

```bash
create_resource_group() {
    if [ $# -lt 2 ]; then
        echo "Uso: create_resource_group [nome do resource group] [região]"
        echo "Exemplo: create_resource_group MeuResourceGroup eastus"
        return 1
    fi
    az group create --name $1 --location $2
}
```

## Etapa 4: Carregar o arquivo de funções

Use o comando `source` para carregar o arquivo com as funções na sua sessão atual:

```bash
source resource_group_functions.sh
```

## Etapa 5: Testar a função

Teste a criação de um resource group com a função:

```bash
create_resource_group mdc-rg eastus
```

<!-- truncate -->