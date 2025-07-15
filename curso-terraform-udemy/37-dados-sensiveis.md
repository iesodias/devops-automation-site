---
id: 19-dados-sensiveis
title: Lab 19 - Trabalhando com Dados Sensíveis no Terraform
noindex: true
---

# Trabalhando com Dados Sensíveis no Terraform

## Introdução

Quando usamos infraestrutura como código, muitas vezes precisamos lidar com informações sensíveis como senhas, tokens de acesso, chaves de API, connection strings e certificados. Se essas informações forem expostas, podem comprometer não só um ambiente de desenvolvimento, mas toda a operação em produção. Por isso, é fundamental compreender como o Terraform trata dados sensíveis e quais cuidados tomar.

## O que são dados sensíveis

Dados sensíveis são informações que devem ser protegidas contra acesso não autorizado. Em contextos de infraestrutura, isso inclui:

* Senhas de VMs ou banco de dados
* Chaves de API para acesso a serviços
* Tokens de autenticação para pipelines
* Strings de conexão com bancos de dados ou storage
* Certificados e chaves privadas

Esses dados, se vazados, podem ser usados para acessar ambientes internos, causar interrupções ou até mesmo ataques com perda de dados.

## Explicação técnica

O Terraform trata dados sensíveis de maneira especial, mas é o desenvolvedor que precisa aplicar boas práticas para garantir segurança total. Alguns pontos importantes:

* **Variáveis podem conter valores sensíveis**. Por padrão, o Terraform não sabe se um valor é sensível ou não — você precisa marcar variáveis como `sensitive = true`.

* **Arquivos de estado (`terraform.tfstate`) armazenam valores reais** de variáveis, incluindo segredos. Esses arquivos devem ser protegidos e nunca versionados em repositórios públicos.

* **Saídas (`output`) também podem conter dados sensíveis**. O ideal é marcá-las como `sensitive = true` para evitar que apareçam no terminal.

* **Workspaces compartilhados**, como os usados em automações com pipelines, precisam de criptografia e controle de acesso rigoroso para o arquivo de estado.

## Riscos e perigos

* **Vazamento de credenciais em repositórios**: Se você definir senhas ou tokens diretamente no `.tf` ou em arquivos `.tfvars`, há risco de subir isso para o Git sem querer.

* **Logs com informações sensíveis**: Durante `terraform plan` ou `terraform apply`, se outputs ou mensagens de erro exibirem valores sensíveis, eles poderão ser gravados em logs automatizados.

* **Estado armazenado sem criptografia**: Armazenar `terraform.tfstate` em buckets ou blobs sem proteção é abrir uma porta para ataques.

* **Ambientes mal configurados**: Falta de segregação entre ambientes (dev, test, prod) pode fazer com que segredos vazem de um para outro.

## Cenários comuns de uso

* **VMs com senha de administrador**: A senha precisa estar em um cofre, como o Azure Key Vault, e o Terraform acessa isso via `data`.

* **Deploy de banco de dados com usuário e senha**: Nunca defina `admin_password = "Senha123"` no código.

* **Aplicações que usam tokens ou certificados**: O ideal é configurar serviços como App Service ou AKS para referenciar valores do Key Vault.

* **Provisionamento com pipelines (GitHub Actions, Azure DevOps)**: Use secrets do pipeline para injetar valores no `terraform.tfvars`, sem expor conteúdo sensível.

## Conclusão

Dados sensíveis exigem atenção redobrada no Terraform. O simples fato de “tudo estar funcionando” não significa que está seguro. Segurança precisa ser tratada como parte do design da infraestrutura, não como um ajuste posterior. Em módulos futuros, vamos explorar como proteger secrets com Key Vault e como configurar ambientes de automação com segurança reforçada.
