---
id: 24-sentinel
title: Aula 24 - Sentinel no Terraform Cloud
noindex: true
---

# Sentinel no Terraform Cloud

## Introdução

O Sentinel é uma ferramenta de **Policy as Code** da HashiCorp que permite definir regras de segurança, conformidade e governança para recursos gerenciados com Terraform. Ele é uma peça essencial no Terraform Cloud (em planos Team & Governance ou superiores), especialmente para ambientes corporativos que exigem validações antes do `apply`.

---

## O que é o Sentinel

O **Sentinel** é um framework de política que permite restringir ou aprovar comportamentos com base em regras declarativas. É usado principalmente com:

* Terraform Cloud e Enterprise
* Vault, Consul e Nomad (outros produtos HashiCorp)

Com ele, você pode, por exemplo:

* Impedir que VMs sejam criadas fora de uma determinada região
* Garantir que certos tags estejam sempre presentes
* Bloquear recursos com custo acima de um limite

---

## Quais recursos o Sentinel oferece no Terraform Cloud

* **Políticas obrigatórias (enforced):** bloqueiam o `apply` se não forem satisfeitas
* **Políticas informativas (advisory):** avisam, mas não impedem a aplicação
* **Políticas permissivas (soft mandatory):** bloqueiam o `apply` mas podem ser substituídas manualmente (override)
* **Integração com workspaces**: políticas podem ser aplicadas por workspace
* **Acesso a dados do plan:** acesso ao plano de execução para validar recursos, atributos, etc.

---

## Terraform CLI vs Terraform Cloud (Sentinel)

| Funcionalidade                     | Terraform CLI (local) | Terraform Cloud + Sentinel |
| ---------------------------------- | --------------------- | -------------------------- |
| Execução de políticas Sentinel     | Não suporta           | Sim                        |
| Níveis de política (advisory, etc) | Não                   | Sim                        |
| Integração com `plan`              | Manual via script     | Automática                 |
| Regras de compliance               | Manual                | Automatizadas              |

---

## Exemplo de política básica

```hcl
import "tfplan/v2"

main = rule {
  all tfplan.resources.aws_instance as _, instances {
    all instances as instance {
      instance.applied.tags["Environment"] is not null
    }
  }
}
```

Essa política garante que toda `aws_instance` tenha uma tag `Environment` definida.

---

## Boas práticas

* Use Sentinel para **padronizar ambientes** entre equipes
* Evite regras excessivamente restritivas (geram frustração)
* Use `advisory` para iniciar a cultura de políticas
* Documente cada política com comentários claros
* Teste as políticas localmente com `sentinel test` (disponível no Sentinel CLI)