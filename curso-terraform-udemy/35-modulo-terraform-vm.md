---
id: 17-modulos-teoria
title: Lab 17 - Módulos no Terraform
noindex: true
---

# Módulos no Terraform

## Introdução

Conforme os projetos de infraestrutura crescem, manter arquivos `main.tf` com centenas de linhas se torna insustentável. Para resolver isso, o Terraform introduz o conceito de **módulos**, que permitem reutilizar e organizar recursos em blocos reutilizáveis e independentes.

Nesta página, vamos entender profundamente como os módulos funcionam, seus benefícios, estrutura, quando utilizar, como aplicar localmente e em pipelines, além de práticas recomendadas para projetos profissionais.

---

## O que são Módulos no Terraform

Um **módulo** no Terraform é qualquer conjunto de arquivos `.tf` em um diretório. O próprio diretório onde você escreve seu `main.tf` principal já é um módulo implícito.

No entanto, ao separar partes da infraestrutura (como rede, máquinas virtuais, storage, etc.) em diretórios próprios e reutilizáveis, você cria **módulos explícitos**. Isso melhora a manutenibilidade, padronização e facilita o versionamento.

Você pode:

* Usar **módulos locais** (na mesma estrutura do projeto)
* Usar **módulos remotos** (de um repositório Git, Registry oficial ou privado)

---

## Explicação Técnica

### Como funciona:

* Cada módulo recebe **entradas** (`variables.tf`)
* Executa recursos (`main.tf`)
* Expõe **saídas** (`outputs.tf`)
* Pode ter **dependências entre módulos** com `depends_on`

### Como referenciar um módulo:

```hcl
module "nome" {
  source = "./modules/nome-do-modulo"
  variavel1 = "valor"
  variavel2 = 123
}
```

O Terraform copia o conteúdo do módulo referenciado durante o `init`, processa as variáveis e cria os recursos como se estivessem no `main.tf`.

### Fontes válidas para `source`:

* Caminho local: `./modules/vm`
* Repositório Git: `git::https://github.com/org/modulo.git`
* Terraform Registry: `terraform-azure-modules/network/azurerm`

---

## Benefícios dos Módulos

* **Reutilização de código**: escreva uma vez, use em vários projetos
* **Organização**: separação lógica por domínio (rede, VM, segurança...)
* **Padronização**: evita que cada equipe implemente do seu jeito
* **Versionamento**: módulos podem ter versões fixas em Git ou Registry
* **Testabilidade**: facilita testes de componentes isolados

---

## Quando usar Módulos

* Sempre que houver **repetição de recursos** (ex: várias VMs com padrões)
* Em **ambientes distintos** (dev, hml, prod)
* Quando for construir **infraestrutura reutilizável por outras squads**
* Para separar responsabilidades entre times (ex: time de rede vs time de apps)

---

## Quando rodar localmente vs pipeline

| Etapa                            | Localmente                         | Na pipeline CI/CD                 |
| -------------------------------- | ---------------------------------- | --------------------------------- |
| Desenvolvimento inicial          | ✅ Criação/teste dos módulos        | ⚠️ Apenas revisão da estrutura    |
| Validação sintaxe                | ✅ `terraform validate`             | ✅ Automatizado no CI              |
| Execução de testes (OPA/Checkov) | ✅ Teste local com dados fictícios  | ✅ Automático com `plan.json`      |
| Execução real (`apply`)          | ❌ Evitar aplicar direto localmente | ✅ Aprovado via PR/CI com política |

---

## Exemplo simples

Estrutura:

```
infra/
├── main.tf
├── variables.tf
├── terraform.tfvars
└── modules/
    └── vm/
        ├── main.tf
        ├── variables.tf
        └── outputs.tf
```

`infra/main.tf`

```hcl
module "vm" {
  source = "./modules/vm"
  nome   = "vm-dev"
  imagem = "UbuntuServer"
  tamanho = "Standard_B1s"
}
```

`modules/vm/main.tf`

```hcl
resource "azurerm_linux_virtual_machine" "vm" {
  name     = var.nome
  size     = var.tamanho
  ...
}
```

`modules/vm/variables.tf`

```hcl
variable "nome" {
  type = string
}

variable "imagem" {
  type = string
}

variable "tamanho" {
  type = string
}
```

`modules/vm/outputs.tf`

```hcl
output "vm_name" {
  value = azurerm_linux_virtual_machine.vm.name
}
```

---

## Output esperado

```bash
Apply complete! Resources: 1 added.

Outputs:
vm_name = "vm-dev"
```

---

## Melhores práticas

* Sempre use `variables.tf`, `outputs.tf` e `README.md` dentro dos módulos
* Separe módulos reutilizáveis por domínio (ex: `vm`, `network`, `app`)
* Utilize `terraform-docs` para gerar documentações automáticas dos módulos
* Nomeie variáveis com clareza e padronização (`prefixo_vm`, `env`, etc.)
* Mantenha os módulos versionados em Git ou Registry privado
* Prefira módulos **puros**, sem lógica de ambiente dentro deles
* Evite **módulos acoplados** com muitos recursos juntos

---

## Conclusão

O uso de módulos em Terraform é essencial para escalar projetos de infraestrutura com qualidade, padronização e governança. Além de reduzir erros humanos, módulos promovem reutilização, isolamento e clareza na estrutura do código.

A adoção correta de módulos desde o início facilita o crescimento do projeto e torna a esteira de DevOps mais robusta e confiável.
