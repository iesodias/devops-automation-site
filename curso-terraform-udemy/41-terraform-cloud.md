---
id: 23-terraform-cloud
title: Aula 23 - Terraform Cloud - Introdução
noindex: true
---

# Terraform Cloud - Introdução

## Introdução

O Terraform Cloud é uma plataforma SaaS (Software como Serviço) da HashiCorp que permite gerenciar infraestrutura como código de forma centralizada, colaborativa e segura. Ele é ideal para equipes que trabalham com infraestrutura automatizada em nuvem, oferecendo controle de versionamento, armazenamento remoto de estado e execução automatizada de planos.

---

## O que é

O **Terraform Cloud** é uma versão hospedada do Terraform que oferece:

* Backend remoto para o arquivo de estado (`terraform.tfstate`)
* Bloqueio de execução concorrente (state locking)
* Integração com VCS (GitHub, GitLab, Bitbucket, etc.)
* Execução automatizada de `plan` e `apply`
* Controle de acesso baseado em times
* Políticas como código com **Sentinel** (em planos pagos)
* Armazenamento seguro de variáveis sensíveis

Enquanto o Terraform CLI roda localmente, o Terraform Cloud centraliza e automatiza esses processos para times maiores ou ambientes mais controlados.

---

## Quais recursos tem? Diferenças do Terraform CLI (local)

| Recurso                   | Terraform CLI (Local)  | Terraform Cloud      |
| ------------------------- | ---------------------- | -------------------- |
| Execução de planos        | Manual (local)         | Automática ou manual |
| Armazenamento de estado   | Local/Remoto (S3, etc) | Remoto e seguro      |
| Bloqueio de estado        | Manual ou via backend  | Automático           |
| Integração com VCS        | Não                    | Sim                  |
| Controle de acesso (RBAC) | Não                    | Sim (por time)       |
| Auditoria e logs          | Limitado               | Centralizado         |
| Políticas de segurança    | Manual                 | Sentinel (avançado)  |

---

## Exemplo prático: usando Terraform Cloud com Azure

### Pré-requisitos

* Conta no [Terraform Cloud](https://app.terraform.io/)
* Projeto Terraform existente (por exemplo: criação de uma VM no Azure)
* GitHub com repositório contendo os arquivos `.tf`

### Etapas

1. **Crie um workspace no Terraform Cloud**:

   * Nomeie o workspace (ex: `azure-vm-dev`)
   * Escolha VCS como método de conexão
   * Aponte para o repositório com o código

2. **Configure variáveis no Terraform Cloud**:

   * Ex: `ARM_CLIENT_ID`, `ARM_CLIENT_SECRET`, `ARM_SUBSCRIPTION_ID`, `ARM_TENANT_ID`
   * Marque como `sensitive` se for secreto

3. **Push no repositório Git**

   * O Terraform Cloud detecta a mudança e dispara automaticamente o `terraform plan`

4. **Aprovação manual (se configurado)**

   * O `apply` pode ser executado manualmente após revisão

---

## Boas práticas

* **Use workspaces separados** para ambientes (`dev`, `hml`, `prod`)
* **Nunca armazene secrets no código-fonte**, use variáveis sensíveis no Terraform Cloud
* **Automatize via GitOps**: push no repositório = nova execução
* **Configure acesso por times**: menor privilégio possível
* **Revise planos antes do apply**: mantenha segurança e controle
* **Utilize policies com Sentinel** (em planos pagos) para validar regras de negócio/compliance

---

Com o Terraform Cloud, você ganha controle, automação e segurança em escala para sua infraestrutura como código, especialmente em ambientes colaborativos. É uma evolução natural ao sair do modo "manual" com o Terraform CLI para um ciclo mais completo e profissional.
