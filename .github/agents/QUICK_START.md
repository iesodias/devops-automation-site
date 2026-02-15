# Quick Start Guide - Sistema de Agentes Copilot

## 🚀 Início Rápido (2 minutos)

### Como Usar

Invoque o orquestrador principal:

```
@orquestrador-blog Crie um artigo sobre [TEMA]
```

### Exemplos Prontos para Copiar

```
@orquestrador-blog Crie um artigo sobre Platform Engineering em 2025
```

```
@orquestrador-blog Crie um artigo sobre Terraform Security com Checkov e Trivy
```

```
@orquestrador-blog Crie um tutorial de GitHub Actions CI/CD - inclua exemplos práticos
```

## 📋 O Que Vai Acontecer

1. **FASE 1 - Preparação** (30 seg)
   - Sistema cria workspace
   - Lê contexto do blog

2. **FASE 2 - Pesquisa** (2-3 min)
   - Pesquisador busca dados, estatísticas, casos reais
   - Identifica curso relacionado
   - Gera briefing completo

3. **FASE 3 - Escrita** (3-5 min)
   - Escritor cria artigo de 2000-4500 palavras
   - Tom humano, sem buzzwords
   - SEO otimizado

4. **FASE 4 - Validação** (1-2 min)
   - Validador analisa 6 categorias
   - Pontuação mínima: 85%

5. **FASE 5 - Revisão** (se necessário)
   - Máximo 2 ciclos
   - Correções específicas

6. **FASE 6 - Entrega** (30 seg)
   - Artigo final pronto
   - Resumo completo

**Tempo total:** 5-15 minutos

## 📦 Resultado

Você receberá:

```
/workspace/{tema}/
├── intermediate/
│   ├── pesquisa.md       # Briefing de pesquisa
│   ├── artigo-draft.md   # Draft do artigo
│   └── revisao.md        # Parecer de validação
└── output/
    ├── 2026-02-15-tema.md  # ⭐ ARTIGO FINAL
    └── RESUMO.md           # Relatório completo
```

## ✅ Garantias de Qualidade

Todo artigo produzido terá:

- ✅ 2000-4500 palavras em português
- ✅ Front matter completo (title, description, tags, date)
- ✅ Link do curso integrado
- ✅ Zero buzzwords de IA
- ✅ Zero emojis (exceto 👉 no link)
- ✅ Tom humano e autêntico
- ✅ SEO otimizado
- ✅ Mínimo 85% de qualidade

## 🎯 Dicas para Melhores Resultados

### ✅ Temas Ideais

```
Crie um artigo sobre Terraform Security SAST em 2025
Crie um artigo sobre Platform Engineering para Startups
Crie um artigo sobre IA para DevOps: ChatGPT vs Gemini
```

### ⚠️ Evitar Temas Muito Genéricos

```
❌ Crie um artigo sobre DevOps
✅ Crie um artigo sobre Carreira em DevOps em 2025

❌ Crie um artigo sobre Cloud
✅ Crie um artigo sobre Azure IaC com Terraform
```

## 📚 Artigos COM vs SEM Código

### Artigo Analítico (padrão - SEM código)

```
@orquestrador-blog Crie um artigo sobre carreira em DevOps
```

O escritor será instruído a NÃO incluir código. Foco em análise, opinião e estratégia.

### Tutorial (COM código)

```
@orquestrador-blog Crie um tutorial de Terraform - inclua exemplos práticos
```

O escritor será instruído a incluir blocos de código funcionais.

## 🔧 Após Receber o Artigo

### 1. Revisar

```bash
# Ver o artigo final
cat /workspace/{tema}/output/2026-02-15-slug.md

# Ver o resumo
cat /workspace/{tema}/output/RESUMO.md
```

### 2. Publicar

```bash
# Copiar para o blog
cp /workspace/{tema}/output/2026-02-15-slug.md \
   /home/runner/work/devops-automation-site/devops-automation-site/blog/

# Commit e push
cd /home/runner/work/devops-automation-site/devops-automation-site
git add blog/2026-02-15-slug.md
git commit -m "Adiciona artigo: [título]"
git push
```

### 3. Aguardar Deploy

O Docusaurus fará deploy automático do artigo no site.

## 🆘 Troubleshooting

### "Artigo reprovado - buzzwords encontrados"

O validador identificou termos proibidos. O escritor receberá lista específica e corrigirá automaticamente no próximo ciclo.

### "Artigo reprovado - tom de IA"

O validador identificou falta de voz pessoal/opiniões. O escritor adicionará mais autenticidade no próximo ciclo.

### "Curso errado identificado"

Você pode ajustar manualmente o link do curso no artigo final antes de publicar.

## 📖 Documentação Completa

Para detalhes completos, consulte:

- **README.md** - Documentação completa do sistema
- **pesquisador-devops.md** - Instruções do pesquisador
- **escritor-artigos.md** - Instruções do escritor
- **validador-artigos.md** - Instruções do validador
- **orquestrador-blog.md** - Instruções do orquestrador

## 💡 Exemplos de Sucesso Esperados

### Exemplo 1: Artigo Analítico

**Input:**
```
@orquestrador-blog Crie um artigo sobre Platform Engineering em 2025
```

**Output esperado:**
- 2.847 palavras
- 5 seções H2
- Curso: DevOps Automação
- Pontuação: 91%
- 0 buzzwords
- Tom humano: 92%

### Exemplo 2: Tutorial

**Input:**
```
@orquestrador-blog Crie um tutorial de GitHub Actions - inclua exemplos de YAML
```

**Output esperado:**
- 3.124 palavras + código
- 6 seções H2
- Curso: GitHub Actions Automação
- Pontuação: 88%
- Workflows YAML funcionais

## 🎉 Pronto!

Agora você está pronto para começar a criar artigos de alta qualidade automaticamente.

Basta invocar:

```
@orquestrador-blog Crie um artigo sobre [seu tema aqui]
```

---

**Site:** devopsautomation.com.br  
**Repositório:** iesodias/devops-automation-site  
**Localização dos Agentes:** `.github/agents/`
