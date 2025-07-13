---
id: 12-opa-teoria
title: Lab 12 - Introdução ao OPA (Open Policy Agent) no Terraform
noindex: true
---

# Introdução ao OPA (Open Policy Agent) no Terraform

## Introdução

Em projetos de infraestrutura como código, é essencial garantir que os recursos criados estejam de acordo com políticas organizacionais, de segurança e compliance. O **OPA (Open Policy Agent)** é uma ferramenta que permite definir, aplicar e validar essas regras de forma automática, promovendo uma abordagem chamada de **Policy as Code**.

## O que é o OPA

O Open Policy Agent é um mecanismo de decisão genérico e open source, que pode ser integrado a diversas ferramentas para verificar se determinada ação está de acordo com uma política definida. No contexto do Terraform, ele permite validar arquivos `.tf` antes do `apply`, garantindo conformidade desde o desenvolvimento.

## Explicação técnica

* OPA usa uma linguagem chamada **Rego** para escrever políticas.
* Essas políticas são aplicadas a arquivos JSON gerados a partir do Terraform com `terraform plan -out=planfile && terraform show -json planfile > plan.json`.
* OPA é agnóstico ao provedor (funciona com AWS, Azure, GCP, etc.).
* Pode rodar localmente na máquina do desenvolvedor ou em pipelines CI/CD.

### Benefícios do OPA no Terraform

* Garante que recursos só serão aplicados se estiverem dentro das políticas definidas
* Evita que regras de segurança sejam burladas acidentalmente
* Centraliza e padroniza as validações de compliance
* Facilita auditorias e governança

### Onde aplicar o OPA

* **Localmente**: para que desenvolvedores validem seus planos antes de subir para o repositório
* **Na pipeline CI/CD**: para impedir que código fora do padrão seja aplicado automaticamente
* **Em sistemas de PR (Pull Requests)**: garantindo que as mudanças estejam conforme as regras

## Melhores práticas

* Mantenha suas políticas versionadas junto ao código IaC
* Utilize nomenclaturas claras para identificar cada regra
* Aplique OPA localmente e na CI/CD para cobertura total
* Use mensagens de erro explicativas para facilitar correções
* Divida as regras por temas: rede, identidade, criptografia, tags, etc.
* Documente políticas obrigatórias vs. recomendadas (ex: warn x deny)

## Conclusão

O OPA é uma poderosa ferramenta para aplicar segurança, boas práticas e conformidade desde a criação da infraestrutura. Com ele, você profissionaliza seu pipeline e reduz riscos operacionais e legais, garantindo que tudo o que for provisionado esteja dentro das regras definidas pela sua organização.
