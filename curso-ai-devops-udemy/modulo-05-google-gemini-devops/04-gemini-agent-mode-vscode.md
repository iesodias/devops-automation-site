---
id: gemini-agent-mode-vscode
title: Gemini Agent Mode no VSCode
slug: /gemini-agent-mode-vscode
noindex: true
---

# AULA 5.4 - GEMINI AGENT MODE NO VSCODE
## Material de Referência para Instrutor

---

## INTRODUÇÃO

**Pergunta Central:** Como usar IA que não apenas sugere, mas planeja e executa refatorações massivas em projetos Terraform?

Agent Mode é a evolução do Gemini no VSCode. Não é chat que responde perguntas - é um agente que recebe uma instrução complexa, planeja como executar, e modifica dezenas de arquivos automaticamente. Imaginem dizer "migre todos os recursos para modules Terraform" e ver 50+ arquivos sendo refatorados sistematicamente.

---

## O QUE VAMOS APRENDER

### Objetivos de Aprendizagem:
1. **Ativar** Agent Mode no VSCode em 1 minuto
2. **Executar** 3 refatorações massivas em projetos Terraform
3. **Usar** checkpoint/rollback para experimentar sem medo

### Competências Desenvolvidas:
- Refatoração automatizada de Infrastructure as Code
- Migração segura de arquiteturas Terraform
- Modernização de projetos Azure em larga escala

---

## O QUE É AGENT MODE

### **IA que Planeja e Executa**

**Diferencial Revolucionário:**
- **Multi-file Intelligence:** Vê projeto Terraform inteiro
- **Planning Capability:** Quebra tarefas complexas em etapas
- **Auto-execution:** Modifica arquivos automaticamente
- **Checkpoint System:** Rollback se algo der errado

### **Chat vs Agent Mode:**

| Chat Normal | Agent Mode |
|-------------|------------|
| "Como criar module?" | Cria modules + migra recursos automaticamente |
| "Sugere melhoria" | Implementa melhorias em todos arquivos |
| Responde apenas | Planeja + executa + valida |

### **Por que é Perfeito para Terraform:**
- Projetos Terraform têm múltiplos arquivos relacionados
- Refatoração manual é propensa a erros
- Consistência entre ambientes é crítica
- Rollback automático garante segurança

---

## 3 REFATORAÇÕES ESSENCIAIS

### **1. Migrar Recursos para Modules Terraform**
```
Prompt: "Migre todos os Storage Accounts para module reutilizável:
- Crie module em modules/storage-account/
- Migre resources dos 3 ambientes (dev/staging/prod)
- Mantenha naming conventions
- Preserve todas as configurações"

Agent Mode:
1. Analisa todos arquivos .tf no projeto
2. Identifica padrões de Storage Account
3. Cria module structure completa
4. Refatora main.tf de cada ambiente
5. Atualiza variables e outputs
6. Valida sintaxe Terraform
```

### **2. Adicionar Tags Padronizadas em Massa**
```
Prompt: "Adicione tags obrigatórias em todos recursos Azure:
- CostCenter: ${var.cost_center}
- Environment: ${var.environment} 
- Owner: ${var.owner}
- CreatedBy: terraform
- Mantenha tags existentes"

Agent Mode:
1. Escaneia todos recursos Azure no projeto
2. Identifica recursos sem tags completas
3. Adiciona locals{} para tag management
4. Atualiza cada resource com tags
5. Cria variables.tf para novas vars
```

### **3. Modernizar para Terraform 1.5+ Best Practices**
```
Prompt: "Modernize projeto para Terraform 1.5:
- Convert count para for_each onde apropriado
- Adicione validation blocks em variables
- Implemente lifecycle rules
- Organize providers em versions.tf
- Adicione terraform{} block com required_version"

Agent Mode:
1. Analisa versão atual e patterns
2. Identifica oportunidades de modernização  
3. Refatora resources com for_each
4. Adiciona validations e lifecycles
5. Reorganiza estrutura de arquivos
```

---

## CASOS PRÁTICOS DETALHADOS

### **Caso 1: Projeto Terraform Desorganizado**
```
Situação Inicial:
├── main.tf (500+ linhas, tudo misturado)
├── variables.tf (sem validações)
└── outputs.tf (mínimo)

Prompt Agent Mode:
"Organize este projeto Terraform seguindo best practices:
- Separe por tipo de recurso (networking.tf, storage.tf, security.tf)
- Crie modules para componentes reutilizáveis
- Adicione validações em variables
- Organize outputs por categoria"

Result After Agent:
├── networking.tf
├── storage.tf  
├── security.tf
├── variables.tf (com validation blocks)
├── outputs.tf (organizados)
├── versions.tf
└── modules/
    ├── storage-account/
    └── virtual-network/
```

### **Caso 2: Multi-Environment Inconsistency**
```
Problema: 3 ambientes com configurações diferentes

Prompt Agent Mode:
"Padronize configurações entre dev/staging/prod:
- Use locals{} para configurações por ambiente
- Implemente workspace-based deployment
- Garanta naming consistency
- Padronize tags e policies"

Agent Mode Actions:
1. Analisa diferenças entre ambientes
2. Cria locals.tf com environment configs
3. Refatora resources para usar locals
4. Implementa terraform.workspace logic
5. Padroniza naming patterns
```

### **Caso 3: Security Hardening em Massa**
```
Prompt Agent Mode:
"Implemente security best practices em todos recursos:
- Storage Accounts: disable public access, enable encryption
- Key Vaults: enable purge protection, firewall rules
- VNets: add NSG rules, disable BGP propagation
- Adicione data sources para security policies"

Agent Execution:
1. Identifica todos recursos de security
2. Aplica hardening configs sistemáticamente
3. Adiciona data sources necessários
4. Cria locals para security policies
5. Valida compliance com Azure policies
```

---

## SETUP E CONFIGURAÇÃO

### **Ativar Agent Mode (1 minuto):**

1. **VSCode + Extension**
   ```bash
   # Instalar Gemini Code Assist extension
   code --install-extension GoogleCloudPlatform.gemini-code-assist
   ```

2. **Configurar Gemini Pro (necessário)**
   - Agent Mode requer Gemini Pro ($19.99/mês)
   - Context window 1M tokens essencial para projetos
   - Free tier não suporta Agent Mode

3. **Ativar no Projeto**
   ```
   Ctrl+Shift+P → "Gemini: Enable Agent Mode"
   Select workspace folder
   ```

### **Checkpoint System:**
```
Antes da Refatoração:
✅ Agent cria checkpoint automático
✅ Git commit com estado inicial
✅ Backup local dos arquivos

Durante Execução:
🔄 Agent mostra progresso em tempo real
🔄 Valida sintaxe a cada mudança
🔄 Para se encontrar erro

Se Algo Der Errado:
↩️ Um clique para rollback completo
↩️ Git reset para checkpoint
↩️ Arquivos restaurados automaticamente
```

---

## DIFERENCIAL vs OUTRAS FERRAMENTAS

| Capability | Agent Mode | ChatGPT | GitHub Copilot | Terraform AI |
|------------|------------|---------|----------------|---------------|
| **Multi-file Refactor** | ✅ Automático | ❌ Manual | ❌ Sugestões | ❌ Limitado |
| **Project Understanding** | ✅ Completo | ❌ Fragmentado | ✅ Parcial | ✅ Terraform only |
| **Auto-execution** | ✅ Planeja + executa | ❌ Só sugere | ❌ Só sugere | ❌ Só sugere |
| **Rollback Safety** | ✅ Checkpoint system | ❌ Manual | ❌ Manual | ❌ Manual |
| **Terraform Expert** | ✅ Best practices | ✅ Básico | ❌ Limitado | ✅ Especializado |

### **Quando Agent Mode é Essencial:**
- **50+ arquivos Terraform** para refatorar
- **Multiple environments** que precisam ficar consistentes  
- **Legacy projects** que precisam de modernização
- **Team standards** que precisam ser aplicados em massa

---

## INTEGRANDO COM WORKFLOWS

### **Pre-commit Hook com Agent:**
```bash
#!/bin/bash
# .git/hooks/pre-commit
echo "Rodando Agent Mode para padronização..."

# Agent padroniza antes do commit
gemini-agent "Padronize este commit seguindo team standards:
- Format com terraform fmt
- Validate syntax
- Check security policies
- Add missing tags"
```

### **CI/CD com Agent Validation:**
```yaml
# .github/workflows/terraform.yml
- name: Agent Mode Validation
  run: |
    gemini-agent "Valide este PR para produção:
    - Check breaking changes
    - Validate resource dependencies  
    - Ensure naming conventions
    - Review security configs"
```

### **Onboarding Automation:**
```
Prompt para Novos Projetos:
"Setup novo projeto Terraform seguindo company standards:
- Estrutura de pastas padrão
- Provider configurations
- Module structure básica
- CI/CD pipeline templates
- Security baselines"
```

---

## PRIMEIROS PASSOS

### **Primeiro Teste (hoje mesmo):**

1. **Projeto Terraform Simples**
   ```
   Crie projeto básico:
   - 1 Storage Account
   - 1 Resource Group
   - Variables básicas
   ```

2. **Teste Agent Mode**
   ```
   Prompt: "Organize este projeto seguindo best practices:
   - Separe em arquivos lógicos
   - Adicione validation em variables
   - Crie locals para configuração"
   ```

3. **Observe Execução**
   ```
   ✅ Agent analisa estrutura atual
   ✅ Planeja refatoração em etapas
   ✅ Executa mudanças automaticamente
   ✅ Valida sintaxe Terraform
   ✅ Oferece rollback se necessário
   ```

### **Casos Progressivos:**
- **Semana 1:** Organize projeto pequeno
- **Semana 2:** Migre resources para modules
- **Semana 3:** Padronize múltiplos ambientes
- **Semana 4:** Security hardening em massa

---

## CONCLUSÃO

### Takeaway Principal:
**Agent Mode não é chat - é assistente que executa.** Recebe instrução complexa, planeja execução, e refatora dezenas de arquivos Terraform automaticamente com checkpoint/rollback para segurança total.

### Transformação de Workflow:
- **Refatoração manual → Automática**
- **Dias de trabalho → Minutos de execução**  
- **Erro-prone → Sistemático e validado**
- **Medo de quebrar → Experimento confiante**

### Casos de Uso Essenciais:
- **Legacy modernization** - projetos antigos para best practices
- **Multi-environment consistency** - dev/staging/prod alinhados
- **Team standards enforcement** - aplicar padrões automaticamente
- **Security hardening** - implementar compliance em massa

### Próximos Passos:
- **Ação:** Teste Agent Mode em projeto Terraform hoje
- **Upgrade:** Para Gemini Pro se usar frequentemente  
- **Scale:** Use em projetos maiores progressivamente

### Por que Agent Mode é Game Changer:
- **Primeiro assistente que executa** (não só sugere)
- **Multi-file intelligence** para projetos complexos
- **Checkpoint safety** para experimentar sem medo
- **Terraform expertise** nativa para DevOps

---

**Duração Estimada:** 5 minutos  
**Conceito Chave:** IA que planeja e executa vs IA que só responde  
**Resultado:** Refatoração automática de projeto Terraform funcionando