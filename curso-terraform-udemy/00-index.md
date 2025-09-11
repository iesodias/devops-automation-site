---
id: index
title: Visão Geral do Curso
slug: /
noindex: true
---

# Ementa do Curso: Terraform na Prática com Foco em Segurança

---

## Módulo 0: A Grande Oportunidade em Cloud e DevOps

* **Aula 1**: Boas-vindas e a jornada do curso
* **Aula 2**: O que é Infraestrutura como Código (IaC) e por que ela domina o mercado?
* **Aula 3**: Apresentando o Terraform: A ferramenta padrão para IaC
* **Aula 4**: O Problema: Falhas de segurança por configurações incorretas
* **Aula 5**: Preparando o ambiente: Terraform, CLI da nuvem, VS Code

### 📋 Pré-requisitos e Instalação do Terraform

#### 🐧 **Instalação no Linux/WSL**

**Ubuntu/Debian:**
```bash
# Adicionar repositório oficial HashiCorp
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list

# Atualizar e instalar
sudo apt update && sudo apt install terraform

# Verificar instalação
terraform --version
```

**CentOS/RHEL/Fedora:**
```bash
# Adicionar repositório HashiCorp
sudo yum install -y yum-utils
sudo yum-config-manager --add-repo https://rpm.releases.hashicorp.com/RHEL/hashicorp.repo

# Instalar Terraform
sudo yum -y install terraform

# Verificar instalação
terraform --version
```

**Instalação Manual (qualquer distribuição):**
```bash
# Baixar binário (verificar versão mais recente em terraform.io)
wget https://releases.hashicorp.com/terraform/1.7.0/terraform_1.7.0_linux_amd64.zip

# Extrair e instalar
unzip terraform_1.7.0_linux_amd64.zip
sudo mv terraform /usr/local/bin/

# Verificar instalação
terraform --version
```

#### 🍎 **Instalação no macOS**

**Método 1 - Homebrew (Recomendado):**
```bash
# Instalar Homebrew (se não estiver instalado)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instalar Terraform
brew tap hashicorp/tap
brew install hashicorp/tap/terraform

# Verificar instalação
terraform --version
```

**Método 2 - Download Manual:**
```bash
# Baixar para macOS (Intel)
curl -O https://releases.hashicorp.com/terraform/1.7.0/terraform_1.7.0_darwin_amd64.zip

# Para macOS (Apple Silicon/M1/M2)
curl -O https://releases.hashicorp.com/terraform/1.7.0/terraform_1.7.0_darwin_arm64.zip

# Extrair e instalar
unzip terraform_1.7.0_darwin_*.zip
sudo mv terraform /usr/local/bin/

# Verificar instalação
terraform --version
```

**Configuração do PATH (se necessário):**
```bash
# Adicionar ao ~/.bashrc ou ~/.zshrc
echo 'export PATH=$PATH:/usr/local/bin' >> ~/.bashrc
source ~/.bashrc
```

---

## 📚 Aulas Disponíveis

### Introdução e Fundamentos:

* **Sobre o Instrutor**
* **Introdução ao IaC**
* **Benefícios do Terraform**
* **Sintaxe HCL**
* **Ciclo de Vida**

### Conceitos Intermediários:

* **Variáveis e Outputs**
* **Tipos de Variáveis**
* **Count e For-Each**
* **Comandos fmt, validate, show**
* **Data Blocks**
* **Workspaces**
* **Locals**

### Estado e Backend:

* **Terraform State Remoto**
* **Arquivo .tfvars**

### Segurança e Compliance:

* **Trivy SAST Shift Left**
* **Trivy SAST Teórico**
* **Checkov - Teoria**
* **Checkov - Prática**
* **Checkov - Integrações**
* **Policy as Code - OPA**
* **OPA Confest**
* **Linguagem Rego**

### Módulos e Gestão de Segredos:

* **Módulo Terraform VM**
* **Dados Sensíveis**
* **Azure Key Vault**
* **VM com Key Vault**

### Terraform Cloud e Enterprise:

* **Terraform Cloud**
* **Terraform Sentinel**

### Laboratórios Práticos:

* **Lab: Resource Group**
* **Lab: Variáveis e Outputs**
* **Lab: For-Each e Count**
* **Lab: Fmt e Show**
* **Lab: State Remoto**
* **Lab: Data Blocks**
* **Lab: TFVars**
* **Lab: Workspaces**
* **Lab: Locals**
* **Lab: Trivy SAST**
* **Lab: Checkov**
* **Lab: OPA Storage/Conftest**
* **Lab: OPA VM/Conftest**
* **Lab: Módulos**
* **Lab: Key Vault**
* **Lab: Terraform Cloud**

### Projeto Final:

* **Teórico Projeto Final**
* **Projeto Final (Apresentação)**
* **Projeto Final**
* **Projeto Final Corrigido**


---

## 📚 Recursos Adicionais

### 🎓 Certificação
- [Guia oficial HashiCorp](https://learn.hashicorp.com/terraform)
- [Documentação do Terraform](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs)

### 🔗 Links Úteis
- [Azure Terraform Provider](https://registry.terraform.io/providers/hashicorp/azurerm/latest)
- [Terraform Azure Examples](https://github.com/terraform-providers/terraform-provider-azurerm/tree/main/examples)
- [Azure Architecture Center](https://docs.microsoft.com/en-us/azure/architecture/)

---

> **💡 Nota**: Este curso aborda os fundamentos essenciais do Terraform com foco em Azure e práticas de segurança. Continue praticando com projetos reais para aprofundar o conhecimento!
