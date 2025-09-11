---
id: prompts-basicos-devops
title: Prompts Básicos para DevOps
slug: /prompts-basicos-devops
noindex: true
---

# Prompts Básicos

## Introdução

**Pergunta Central:** Como transformar problemas técnicos complexos em perguntas que o ChatGPT consegue resolver efetivamente?

A diferença entre "meu servidor está com problema" e "analise este log do Apache e identifique por que está retornando erro 500 para requests POST" é a diferença entre perder tempo e resolver problemas rapidamente.

**Por que prompts específicos são essenciais:**
- Problemas técnicos precisam de contexto específico
- ChatGPT precisa entender o ambiente e situação
- Prompts vagos geram soluções genéricas
- Prompts estruturados economizam iterações

---

## O QUE VAMOS APRENDER

### Objetivos de Aprendizagem:

1. **Criar** prompts estruturados para problemas comuns de DevOps
2. **Aplicar** template básico para diferentes cenários técnicos
3. **Adaptar** linguagem técnica para maximizar compreensão da IA
4. **Otimizar** interações para resolver problemas mais rapidamente

### Competências Desenvolvidas:
- Estruturação de problemas técnicos para IA
- Comunicação eficaz com sistemas de IA
- Diagnóstico acelerado usando prompts direcionados
- Aproveitamento máximo das capacidades do ChatGPT

---

## ANATOMIA DE UM PROMPT EFICAZ

### Estrutura Base:

```
[CONTEXTO] + [PROBLEMA ESPECÍFICO] + [AÇÃO DESEJADA] + [FORMATO DE RESPOSTA]
```

### Componentes Essenciais:

#### 1. **Contexto Técnico**
- Sistema operacional e versões
- Tecnologias envolvidas
- Ambiente (dev/staging/prod)
- Configurações relevantes

#### 2. **Problema Específico**
- Sintomas observados
- Quando começou
- Frequência/padrão
- Logs ou mensagens de erro

#### 3. **Ação Desejada**
- O que você quer que seja feito
- Tipo de análise necessária
- Profundidade da investigação
- Prioridade da solução

#### 4. **Formato de Resposta**
- Como quer receber a resposta
- Nível de detalhamento
- Ordem de prioridade
- Passos práticos

---

## TEMPLATES POR CATEGORIA

### 1. **Troubleshooting de Logs**

**Template:**
```
Contexto: [Sistema/Aplicação] rodando em [Ambiente] usando [Tecnologias]
Problema: [Erro específico] acontecendo [Quando/Frequência]
Logs: [Cole os logs relevantes]
Ação: Analise e identifique a causa raiz
Formato: Liste as 3 causas mais prováveis em ordem de probabilidade, 
com passos específicos para verificar cada uma
```

**Exemplo Prático:**
```
Contexto: Aplicação Node.js rodando em produção usando Docker + Nginx
Problema: Erro 502 Bad Gateway acontecendo esporadicamente desde ontem
Logs: [logs do Nginx e container]
Ação: Analise e identifique a causa raiz
Formato: Liste as 3 causas mais prováveis em ordem de probabilidade,
com comandos específicos para verificar cada uma
```

### 2. **Otimização de Performance**

**Template:**
```
Contexto: [Sistema] com [Especificações] servindo [Volume/Carga]
Métricas: [CPU/RAM/Disk/Network] mostrando [Valores atuais]
Objetivo: [Meta de performance específica]
Ação: Sugira otimizações práticas
Formato: Lista priorizada com impacto estimado e dificuldade de implementação
```

### 3. **Configuração de Infraestrutura**

**Template:**
```
Objetivo: Configurar [Tecnologia] para [Caso de uso específico]
Requisitos: [Especificações técnicas e limitações]
Ambiente: [Cloud provider/On-premise] com [Resources disponíveis]
Ação: Forneça configuração completa
Formato: Arquivo de configuração comentado + lista de verificação pós-deploy
```

### 4. **Automação e Scripts**

**Template:**
```
Tarefa: Automatizar [Processo específico]
Entrada: [Dados/Parâmetros disponíveis]
Saída: [Resultado esperado]
Restrições: [Limitações técnicas ou organizacionais]
Ação: Crie script funcional
Formato: Código comentado + instruções de uso + casos de teste
```

### 5. **Segurança e Compliance**

**Template:**
```
Sistema: [Infraestrutura específica]
Preocupação: [Aspecto de segurança específico]
Padrões: [Compliance requirements se houver]
Ação: Avalie e recomende melhorias
Formato: Relatório com nível de risco, impacto e passos de mitigação
```

---

## EXEMPLOS PRÁTICOS DETALHADOS

### Caso 1: Problema de Container

**❌ Prompt Ineficaz:**
```
"Meu container não está funcionando"
```

**✅ Prompt Estruturado:**
```
Contexto: Container Docker da aplicação Python Flask em ambiente de produção
Problema: Container reiniciando constantemente (crash loop) desde deploy de ontem
Logs: 
```
[logs específicos]
```
Ação: Identifique a causa do crash loop e sugira correção
Formato: Causa provável + comando para verificar + solução específica para implementar
```

### Caso 2: Configuração de Load Balancer

**❌ Prompt Ineficaz:**
```
"Como configurar load balancer?"
```

**✅ Prompt Estruturado:**
```
Objetivo: Configurar Nginx como load balancer para 3 servidores web
Requisitos: 
- Distribuição round-robin
- Health checks automáticos
- SSL termination
- Rate limiting de 100 req/min por IP
Ambiente: Ubuntu 22.04 em AWS EC2
Ação: Forneça configuração completa do Nginx
Formato: Arquivo nginx.conf comentado + comandos de teste + checklist de validação
```

### Caso 3: Monitoramento de Performance

**❌ Prompt Ineficaz:**
```
"Sistema está lento"
```

**✅ Prompt Estruturado:**
```
Contexto: API REST em Python servindo 10k requests/dia
Métricas: 
- Response time subiu de 200ms para 2000ms
- CPU: 80% constante
- RAM: 85% usage
- Disk I/O: 90% utilization
Objetivo: Reduzir response time para menos de 500ms
Ação: Identifique gargalos e sugira otimizações
Formato: Análise de cada métrica + 5 otimizações priorizadas por impacto/esforço
```

---

## MELHORES PRÁTICAS

### ✅ Do's:

1. **Seja Específico com Tecnologias**
   - Versões exatas: "Python 3.9", não "Python"
   - Cloud providers: "AWS ECS", não "container service"
   - Ambientes: "produção com 1000 usuários", não "produção"

2. **Inclua Contexto Suficiente**
   - Configurações relevantes
   - Mudanças recentes
   - Ambiente e constraints
   - Objetivos de negócio quando relevante

3. **Peça Formato Específico**
   - "Lista com 3 itens priorizados"
   - "Código comentado + instruções"
   - "Análise passo-a-passo"
   - "Tabela comparativa"

4. **Use Logs e Dados Reais**
   - Cole logs específicos
   - Inclua métricas exatas
   - Forneça outputs de comandos
   - Compartilhe configurações atuais

### ❌ Don'ts:

1. **Evite Generalidades**
   - "Melhore performance"
   - "Configure segurança"  
   - "Otimize sistema"
   - "Resolva problema"

2. **Não Omita Contexto Crítico**
   - Versões de software
   - Especificações de hardware
   - Configurações de rede
   - Restrições organizacionais

3. **Não Peça Tudo de Uma Vez**
   - Análise + solução + documentação + testes
   - Múltiplos sistemas diferentes
   - Várias tecnologias não relacionadas
   - Problemas distintos misturados

---

## FRAMEWORK DE ITERAÇÃO

### Primeira Interação:
1. Use template estruturado
2. Forneça contexto completo  
3. Seja específico na ação
4. Defina formato de resposta

### Refinamentos:
- "Detalhe mais o passo 2"
- "Adapte para ambiente Ubuntu"
- "Inclua considerações de segurança"
- "Simplifique para equipe junior"

### Validação:
- "Este comando funcionará no meu ambiente?"
- "Há riscos em aplicar essa solução?"
- "Como verifico se funcionou corretamente?"
- "Que monitoramento adicionar?"

---

## CONCLUSÃO

### Principais Takeaways:

1. **Estrutura É Fundamental**
   - Contexto + Problema + Ação + Formato
   - Específico sempre vence genérico
   - Dados reais geram soluções práticas

2. **Templates Aceleram Resultados**
   - Troubleshooting: contexto + logs + análise direcionada
   - Configuração: objetivo + requisitos + formato específico
   - Performance: métricas + metas + otimizações priorizadas

3. **Iteração Inteligente**
   - Comece estruturado
   - Refine baseado na resposta
   - Valide antes de implementar
   - Documente o que funcionou

### Aplicação Prática:

**Use estes templates como base**, adapte para seu contexto específico e sempre inclua dados reais. A diferença entre prompt eficaz e ineficaz é a diferença entre resolver o problema em uma iteração ou ficar dias tentando.

### Próximos Passos:
- **Módulo 4.7:** Análise de Logs com ChatGPT
- **Prática:** Aplique um template em um problema real hoje
- **Iteração:** Refine baseado nos resultados obtidos

### Recursos de Referência:
- [Template Collection - GitHub](https://github.com/prompt-templates/devops)
- [Best Practices Guide](https://docs.chatgpt-devops.com/prompts)
- [Community Examples](https://community.devops-ai.com/prompts)

---

**Duração Estimada:** 6 minutos  
**Conceito Chave:** Estrutura de prompt determina qualidade da solução  
**Resultado:** Capacidade de criar prompts que geram respostas úteis na primeira tentativa