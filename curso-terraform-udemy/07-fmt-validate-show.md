---
id: fmt-validate-show
title: Aula 6 - Mantendo a Qualidade do Código com fmt, validate e show
noindex: true
---

# Aula 6: Mantendo a Qualidade do Código com fmt, validate e show (Azure)

---

## Introdução

Além do famoso ciclo `init > plan > apply`, o Terraform oferece comandos auxiliares que garantem a **qualidade, consistência e segurança** do seu código: `terraform fmt`, `terraform validate` e `terraform show`.

Esses comandos ajudam a:

* Garantir que o código esteja formatado corretamente
* Validar erros de sintaxe e argumentos
* Inspecionar recursos já criados e entender o estado atual da infraestrutura

---

## O que são `fmt`, `validate` e `show`?

* `terraform fmt`: formata automaticamente os arquivos `.tf`
* `terraform validate`: verifica se a sintaxe e argumentos do código estão corretos
* `terraform show`: exibe informações do estado atual da infraestrutura de forma legível

---

## Explicação Técnica

### `terraform fmt`

* Reescreve os arquivos Terraform com indentação e alinhamento padronizados
* **Não altera a lógica** do código
* Facilita a leitura e o trabalho em equipe

### `terraform validate`

* Valida o código localmente (sem acessar a nuvem)
* Verifica erros de sintaxe, argumentos inválidos e tipos incorretos

### `terraform show`

* Mostra os recursos gerenciados e seus atributos atuais com base no `terraform.tfstate`
* Pode inspecionar arquivos de plano salvos (`.plan`)

---

## Comandos de Referência

```bash
terraform fmt
terraform validate
terraform show
terraform show tfplan
```

---

## Exemplo Prático

### Código mal formatado (`main.tf` antes do fmt):

```hcl
resource   "azurerm_resource_group"   "rg" {
   name="meu-grupo"
location="East US"
}
```

### Rodando o `terraform fmt`

```bash
terraform fmt
```

### Código corrigido após o fmt:

```hcl
resource "azurerm_resource_group" "rg" {
  name     = "meu-grupo"
  location = "East US"
}
```

### Código com erro proposital para o validate:

```hcl
resource "azurerm_resource_group" "rg" {
  nome = "grupo-invalido"
  location = "East US"
}
```

### Rodando o `terraform validate`

```bash
terraform validate
```

#### Output esperado:

```text
│ Error: Unsupported argument
│   on main.tf line 2, in resource "azurerm_resource_group" "rg":
│   2:   nome = "grupo-invalido"
│
│ An argument named "nome" is not expected here.
```

### Corrigindo o erro:

```hcl
resource "azurerm_resource_group" "rg" {
  name     = "grupo-valido"
  location = "East US"
}
```

### Rodando `terraform validate` novamente:

```bash
terraform validate
```

```text
Success! The configuration is valid.
```

---

## Usando `terraform show`

Com infraestrutura já criada e `terraform.tfstate` existente:

```bash
terraform show
```

#### Output esperado (parcial):

```text
# azurerm_resource_group.rg:
resource "azurerm_resource_group" "rg" {
  location = "East US"
  name     = "grupo-valido"
  id       = "/subscriptions/.../resourceGroups/grupo-valido"
}
```

Para analisar um plano salvo:

```bash
terraform plan -out=tfplan
terraform show tfplan
```

---

## Melhores Práticas

* **Use `terraform fmt` antes de qualquer commit** para manter a consistência
* **Valide sempre com `terraform validate` antes do plan**
* **Inspecione com `terraform show` quando precisar entender o que foi criado**
* **Inclua esses comandos em pipelines de CI/CD** para automação da qualidade

---

## Fluxo de Trabalho Profissional

1. Escreve ou edita o código
2. Roda `terraform fmt` para padronizar
3. Roda `terraform validate` para checar erros
4. Roda `terraform plan` para ver as mudanças
5. Roda `terraform apply` para aplicar
6. Usa `terraform show` para inspecionar resultados
