---
id: hcl-intro
title: Aula 1 - A Sintaxe do Terraform (HCL)
noindex: true
---

# Aula 1: A Sintaxe do Terraform (HCL)

---

## O que vamos aprender

Nesta aula, vamos aprender passo a passo como funciona a sintaxe do Terraform usando a linguagem HCL (**HashiCorp Configuration Language**). Você entenderá como escrever arquivos `.tf` de maneira clara e estruturada.

---

## 1. O que é HCL?

HCL significa **HashiCorp Configuration Language**. É uma linguagem de configuração **declarativa**, criada pela HashiCorp, usada por ferramentas como o Terraform para definir recursos de infraestrutura.

Ela foi projetada para ser:

* **Fácil de ler** para humanos
* **Simples de escrever**
* **Flexível** para representar configurações complexas

Um exemplo básico de código em HCL:

```hcl
provider "aws" {
  region = "us-east-1"
}
```

---

## 2. Entendendo a Estrutura: Blocos, Argumentos e Identificadores

O código do Terraform é organizado de forma previsível. Vamos entender os principais componentes:

### Blocos

Tudo no Terraform é escrito dentro de **blocos**. Um bloco começa com uma palavra-chave e pode conter argumentos internos.

Exemplo:

```hcl
resource "aws_instance" "exemplo" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
}
```

### Argumentos

Dentro de um bloco, usamos **argumentos** para definir configurações. Eles seguem a sintaxe:

```hcl
chave = valor
```

### Identificadores

Em alguns blocos, você verá dois nomes entre aspas. O primeiro é o **tipo** e o segundo é o **nome lógico** (identificador) do recurso.

```hcl
resource "aws_instance" "meu_servidor" { ... }
```

* `aws_instance`: tipo de recurso
* `meu_servidor`: nome de referência interna no código

---

## 3. Os blocos mais importantes: provider e resource

### provider

O bloco `provider` define qual serviço de nuvem (ou outro sistema) será usado. Por exemplo, para usar a AWS:

```hcl
provider "aws" {
  region = "us-east-1"
}
```

### resource

O bloco `resource` define os recursos que queremos criar. Exemplo:

```hcl
resource "aws_instance" "exemplo" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
}
```

---

## Recapitulando

Nesta aula, você aprendeu:

* O que é a linguagem HCL
* Como a estrutura do código é organizada em blocos, argumentos e identificadores
* Como usar os blocos `provider` e `resource`
