---
id: ciclo-terraform
title: Aula 2 - O Ciclo de Vida Essencial do Terraform
noindex: true
---

# Aula 2: O Ciclo de Vida Essencial do Terraform

---

## Introdução

Quando você escreve seu código Terraform, ele ainda não faz nada por si só. É preciso instruir o Terraform a **inicializar o projeto**, **planejar as mudanças** e **aplicar essas mudanças na infraestrutura**. Esse processo é conhecido como o **ciclo de vida essencial** do Terraform.

Vamos conhecer os quatro comandos fundamentais:

* `terraform init`
* `terraform plan`
* `terraform apply`
* `terraform destroy`

---

## O que é o Ciclo de Vida no Terraform?

É o fluxo de trabalho básico para provisionar e gerenciar infraestrutura com Terraform. Seguindo essa ordem, você garante que o ambiente esteja sempre consistente, previsível e seguro.

---

## Explicação Técnica

O ciclo de vida funciona em quatro passos:

1. **Inicialização**: prepara o ambiente, instala os plugins e define o backend.
2. **Planejamento**: compara o código com o estado atual e mostra o que será feito.
3. **Aplicação**: executa o plano e cria ou altera a infraestrutura.
4. **Destruição**: remove tudo que foi criado para liberar recursos.

---

## Comandos de Referência

### 1. `terraform init`

```bash
terraform init
```

* Inicia o diretório de trabalho
* Baixa os plugins dos providers declarados (ex: AWS)
* Prepara o backend para o `.tfstate`
* Necessário rodar **apenas uma vez** por projeto (ou quando muda provider)

### 2. `terraform plan`

```bash
terraform plan
```

* Planeja o que será criado, alterado ou destruído
* Gera um "plano de execução"
* Serve como checklist de segurança

### 3. `terraform apply`

```bash
terraform apply
```

* Executa o plano
* Solicita confirmação (digite `yes` para continuar)
* Aplica as mudanças reais na infraestrutura

### 4. `terraform destroy`

```bash
terraform destroy
```

* Lê o estado atual e planeja a remoção de todos os recursos
* Ótimo para limpar ambientes de teste ou desenvolvimento

---

## Exemplo Prático

Com o seguinte código em `main.tf`:

```hcl
provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "meu_bucket_do_curso" {
  bucket = "meu-bucket-do-terraform-curso"
  acl    = "private"
}
```

Execute os comandos na ordem:

```bash
terraform init
terraform plan
terraform apply
```

Depois, para remover tudo:

```bash
terraform destroy
```

---

## Output Esperado

### `terraform init`

```text
Initializing the backend...
Initializing provider plugins...
- Finding latest version of hashicorp/aws...
- Installing hashicorp/aws v5.0.0...
- Installed hashicorp/aws v5.0.0 (signed by HashiCorp)

Terraform has been successfully initialized!
```

### `terraform plan`

```text
Terraform will perform the following actions:

  # aws_s3_bucket.meu_bucket_do_curso will be created
  + resource "aws_s3_bucket" "meu_bucket_do_curso" {
      + acl    = "private"
      + bucket = "meu-bucket-do-terraform-curso"
      ...
    }

Plan: 1 to add, 0 to change, 0 to destroy.
```

### `terraform apply`

```text
Terraform will perform the following actions:

  # aws_s3_bucket.meu_bucket_do_curso will be created
  + resource "aws_s3_bucket" "meu_bucket_do_curso" {
      + acl    = "private"
      + bucket = "meu-bucket-do-terraform-curso"
      ...
    }

Plan: 1 to add, 0 to change, 0 to destroy.

Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value: yes

aws_s3_bucket.meu_bucket_do_curso: Creating...
aws_s3_bucket.meu_bucket_do_curso: Creation complete after 2s [id=meu-bucket-do-terraform-curso]

Apply complete! Resources: 1 added, 0 changed, 0 destroyed.
```

### `terraform destroy`

```text
Terraform will destroy the following resources:

  # aws_s3_bucket.meu_bucket_do_curso will be destroyed
  - resource "aws_s3_bucket" "meu_bucket_do_curso" {
      - acl    = "private" -> null
      - bucket = "meu-bucket-do-terraform-curso" -> null
      ...
    }

Plan: 0 to add, 0 to change, 1 to destroy.

Do you really want to destroy all resources?
  Terraform will destroy all your managed infrastructure.
  There is no undo. Only 'yes' will be accepted to confirm.

  Enter a value: yes

aws_s3_bucket.meu_bucket_do_curso: Destroying...
aws_s3_bucket.meu_bucket_do_curso: Destruction complete after 1s

Destroy complete! Resources: 1 destroyed.
```

---

## Melhores Práticas

* Sempre rode `terraform init` ao iniciar um novo projeto
* Nunca aplique sem revisar o plano com `terraform plan`
* Use `terraform apply -auto-approve` com cuidado, apenas em scripts automatizados
* Prefira `terraform destroy` em ambientes temporários ou de teste
* Verifique o `terraform.tfstate` e, se possível, use backend remoto com lock

---

Com esses quatro comandos, você já domina o ciclo essencial do Terraform.
