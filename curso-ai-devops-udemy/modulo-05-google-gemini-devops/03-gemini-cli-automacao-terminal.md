---
id: gemini-cli-automacao-terminal
title: Gemini CLI - Automação no Terminal
slug: /gemini-cli-automacao-terminal
noindex: true
---

# AULA 5.3 - GEMINI CLI: AUTOMAÇÃO NO TERMINAL
## Material de Referência para Instrutor

---

## INTRODUÇÃO

**Pergunta Central:** Como usar a primeira IA que roda nativamente no terminal para automatizar tarefas Azure e Terraform?

Em julho de 2025, o Google lançou algo que mudou o jogo: Gemini CLI - a primeira IA que funciona 100% no terminal, sem precisar de browser. É gratuita, open-source (Apache 2.0), e perfeita para quem trabalha com Azure, Terraform e automação cloud. DevOps nunca mais será o mesmo.

---

## O QUE VAMOS APRENDER

### Objetivos de Aprendizagem:
1. **Instalar** e configurar Gemini CLI em 2 minutos
2. **Automatizar** 3 tarefas essenciais: Terraform, Azure CLI e Scripts  
3. **Integrar** CLI com workflows cloud existentes

### Competências Desenvolvidas:
- Automação terminal com IA para Azure/Terraform
- Geração automática de Infrastructure as Code
- Otimização de workflows cloud repetitivos

---

## O QUE É GEMINI CLI

### **Primeira IA Terminal Nativa**

**Diferencial Revolucionário:**
- **Terminal-first:** Não precisa de browser ou interface web
- **Open Source:** Apache 2.0 - customize à vontade
- **Gratuito:** 60 requests/minuto sem pagar nada
- **Azure/Terraform Expert:** Entende infraestrutura cloud

### **Por que é Perfeito para DevOps:**
- DevOps vive no terminal
- Integra com Azure CLI e Terraform nativamente
- Gera Infrastructure as Code completo
- Preserva contexto entre comandos
- Funciona com arquivos locais diretamente

### **Instalação em 2 Minutos:**
```bash
# 1. Instalar (precisa Node.js 18+)
npm install -g @google-labs/gemini-cli

# 2. Configurar API key
gemini config

# 3. Testar
gemini "Crie um Storage Account Azure com Terraform"
```

---

## 3 AUTOMAÇÕES ESSENCIAIS

### **1. Gerar Terraform para Azure Storage Account**
```bash
# Problema: Criar infraestrutura Azure do zero
# Solução: IA gera Terraform completo

gemini "Crie código Terraform para Storage Account Azure com:
- Resource Group: rg-storage-prod  
- Storage Account: stproddata001
- Replication: LRS
- Tier: Standard
- Tags: Environment=Production, Owner=DevOps"

# Output: main.tf + variables.tf + outputs.tf completos
```

### **2. Script Azure CLI para Backup Automático**
```bash
# Problema: Backup manual de recursos Azure
# Solução: Script automatizado com validação

gemini "Crie script bash para backup de Storage Account Azure:
- Export de configurações
- Backup de containers
- Verificação de integridade  
- Log estruturado
- Alertas por email se falhar"

# Output: Script completo + error handling + documentação
```

### **3. Terraform Multi-Resource com Best Practices**
```bash
# Problema: Infraestrutura complexa com muitos recursos
# Solução: Terraform completo seguindo padrões

gemini "Crie Terraform para ambiente Azure completo:
- Virtual Network com subnets
- Storage Account para logs
- Key Vault para secrets
- Seguindo naming conventions Azure
- Com tags padronizadas"

# Output: Estrutura modular + variables + locals + outputs
```

---

## CASOS PRÁTICOS DETALHADOS

### **Caso 1: Storage Account para Data Lake**
```bash
# Cenário: Precisa criar Data Lake no Azure
gemini "Gere Terraform para Azure Data Lake Storage Gen2:
- Hierarchical namespace habilitado
- 3 containers: raw, processed, curated  
- Lifecycle policy para arquivamento
- Network ACLs para segurança"

# Resultado: Terraform + políticas + configurações de segurança
```

### **Caso 2: Script de Monitoramento Azure**
```bash
# Cenário: Monitorar custos e recursos Azure
gemini "Crie script Azure CLI para relatório diário:
- Listar recursos por resource group
- Calcular custos do mês atual
- Identificar recursos órfãos
- Enviar relatório por email
- Executar via cron diariamente"

# Resultado: Script + formatação + integração email
```

### **Caso 3: Terraform para Ambiente Completo**
```bash
# Cenário: Deploy ambiente dev/staging/prod
gemini "Gere Terraform workspace para 3 ambientes:
- Variáveis por ambiente (dev/staging/prod)
- Resource Groups separados
- Storage Accounts com naming pattern
- Tags automáticas por ambiente
- Backend remoto no Azure Storage"

# Resultado: Estrutura multi-environment + workspaces
```

---

## DIFERENCIAL vs OUTRAS FERRAMENTAS

| Recurso | Gemini CLI | ChatGPT Web | GitHub Copilot |
|---------|------------|-------------|----------------|
| **Terminal Nativo** | ✅ | ❌ Browser only | ❌ IDE only |
| **Gratuito** | ✅ 60 req/min | ❌ Limitado | ❌ Pago |
| **Terraform Completo** | ✅ Com best practices | ✅ Básico | ❌ Só snippets |
| **Azure CLI Integration** | ✅ Nativo | ❌ Copy/paste | ❌ Limitado |
| **Files Locais** | ✅ Lê/escreve direto | ❌ Manual | ✅ Projeto apenas |

### **Vantagens Únicas:**
- **Workflow Natural:** Gera arquivos Terraform diretamente
- **Azure Expert:** Conhece naming conventions e best practices  
- **Context Preservado:** Lembra conversas sobre infraestrutura
- **Integration Ready:** Funciona com Azure DevOps/GitHub Actions

---

## INTEGRANDO COM WORKFLOWS

### **Em Pipelines Azure DevOps:**
```yaml
# azure-pipelines.yml
- task: Bash@3
  displayName: 'Generate Terraform'
  inputs:
    targetType: 'inline'
    script: |
      gemini "Gere Terraform para $(environmentName):
      - Resource Group: rg-$(environmentName)
      - Storage: st$(environmentName)data001" > main.tf
```

### **Com GitHub Actions:**
```yaml
# .github/workflows/infrastructure.yml
- name: Generate Infrastructure Code
  run: |
    gemini "Crie Terraform para PR #${{ github.event.number }}:
    - Preview environment
    - Temporary resources  
    - Auto-destroy após 7 dias" > infrastructure/pr-${{ github.event.number }}.tf
```

### **Script de Provisioning:**
```bash
#!/bin/bash
# provision-env.sh

ENV=$1
echo "Gerando infraestrutura para ambiente: $ENV"

gemini "Crie Terraform para ambiente $ENV:
- Resource Group: rg-$ENV-eastus2
- Storage Account com naming convention
- Tags: Environment=$ENV, CreatedBy=Script" > terraform/$ENV/main.tf

cd terraform/$ENV
terraform init
terraform plan
```

---

## PRIMEIROS PASSOS

### **Setup Completo (5 minutos):**

1. **Instalar Node.js 18+**
   ```bash
   # Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Instalar Gemini CLI**
   ```bash
   npm install -g @google-labs/gemini-cli
   ```

3. **Configurar (precisa Google AI Studio key - gratuito)**
   ```bash
   gemini config
   # Cole sua API key do https://aistudio.google.com
   ```

4. **Testar com Azure/Terraform**
   ```bash
   gemini "Crie Storage Account básico com Terraform"
   ```

### **Primeira Automação (hoje mesmo):**
```bash
# Gere seu primeiro Terraform
gemini "Crie Terraform para Storage Account Azure:
- Nome: st[seuname]dev001
- Resource Group: rg-dev-test
- Location: East US 2
- Replication: LRS" > storage.tf

# Valide o código gerado
terraform fmt storage.tf
terraform validate
```

---

## CONCLUSÃO

### Takeaway Principal:
**Gemini CLI é a primeira IA feita para DevOps que trabalham com Azure e Terraform.** Gratuita, terminal-nativa, e gera Infrastructure as Code completo sem sair da linha de comando.

### Transformação Imediata:
- **Terraform:** Escrever → pedir para IA gerar
- **Azure Scripts:** Desenvolver → automatizar com IA
- **Infraestrutura:** Manual → código gerado instantaneamente

### Próximos Passos:
- **Módulo 5.4:** Gemini Agent Mode no VSCode  
- **Ação:** Instale CLI e gere seu primeiro Storage Account hoje

### Por que Começar Agora:
- **100% gratuito** - sem risco financeiro
- **Azure/Terraform expert** - entende cloud nativamente
- **Terminal workflow** - DevOps natural
- **Pronto em 2 minutos** - sem setup complexo

---

**Duração Estimada:** 5 minutos  
**Conceito Chave:** IA terminal nativa para Azure/Terraform  
**Resultado:** Storage Account gerado com Terraform funcionando