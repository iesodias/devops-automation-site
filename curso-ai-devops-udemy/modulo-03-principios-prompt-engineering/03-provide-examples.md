---
id: provide-examples
title: Princípio 3 - Provide Examples
slug: /provide-examples
noindex: true
---
# PRINCÍPIO 3: Dê exemplos (Provide Examples)

## INTRODUÇÃO

**Pergunta Central:** Por que algumas pessoas conseguem que a IA entenda exatamente o que querem na primeira tentativa?

O terceiro princípio ensina o poder dos exemplos para guiar a IA. Não basta dar direção e especificar formato - mostrar exemplos concretos elimina ambiguidade e melhora drasticamente a qualidade das respostas.

**Por que este princípio é importante:**
- Exemplos eliminam interpretações incorretas
- Demonstram padrões e estilo desejados
- Reduzem ciclos de refinamento
- Garantem consistência nos resultados

---

## O QUE VAMOS APRENDER

### Objetivos de Aprendizagem:
1. **Compreender** como exemplos melhoram comunicação com IA
2. **Identificar** tipos de exemplos úteis para contextos técnicos
3. **Aplicar** técnica de exemplos em prompts práticos
4. **Reconhecer** quando falta de exemplos prejudica resultado

### Competências Desenvolvidas:
- Capacidade de criar exemplos eficazes
- Habilidade de demonstrar padrões desejados
- Eficiência na comunicação com IA
- Redução de ciclos de tentativa e erro

---

## O QUE É PROVIDE EXAMPLES

### Definição:

**Provide Examples** é incluir exemplos concretos no prompt para mostrar à IA exatamente o tipo, estilo e qualidade de resposta que você espera.

### Por Que Funciona:

A IA aprende por padrões. Quando você mostra exemplos, ela identifica o padrão e replica com suas próprias informações. É como mostrar um modelo antes de pedir para fazer algo similar.

### Analogia Prática:

É como pedir para alguém escrever um relatório. Você pode explicar como quer, ou pode mostrar um exemplo de relatório bem feito e falar "quero algo assim". O segundo é muito mais eficaz.

---

## TIPOS DE EXEMPLOS ÚTEIS

### 1. **Exemplos de Input/Output**
Mostre exatamente como você quer que a IA processe informações similares.

### 2. **Exemplos de Formato**
Demonstre estrutura, estilo e organização desejados.

### 3. **Exemplos de Qualidade**
Indique nível de detalhamento e profundidade esperados.

### 4. **Exemplos de Contexto**
Esclareça que tipo de situação ou ambiente você está trabalhando.

### 5. **Exemplos de Tom**
Defina se quer resposta técnica, executiva, didática, etc.

---

## EXEMPLO CONCEITUAL

### Situação: Análise de Logs de Erro

#### ❌ Sem Exemplos:
```
"Analise este log e me diga o que está errado:
[LOG COMPLEXO DE 50 LINHAS]
```

**Resultado:** IA faz análise genérica, pode focar em detalhes irrelevantes, não segue padrão específico da empresa.

#### ✅ Com Exemplos:
```
"Analise este log seguindo o mesmo padrão do exemplo:

EXEMPLO DE ANÁLISE:
Log: ERROR: Connection refused on port 5432
Análise:
- Categoria: Conectividade de Banco
- Severidade: Alta
- Causa Provável: PostgreSQL service down ou firewall blocking
- Ação Imediata: Verificar status do serviço PostgreSQL
- Investigação: Checar logs do PostgreSQL e regras de firewall

Agora analise este log seguindo o mesmo formato:
[SEU LOG AQUI]"
```

**Resultado:** IA replica exatamente o padrão, formato e profundidade demonstrados no exemplo.

---

## TÉCNICAS DE EXEMPLOS PARA DEVOPS/CLOUD

### Para Troubleshooting:
```
"Exemplo de diagnóstico:
Sintoma: API retorna 500 erro
Investigação: Verificar logs → CPU alta → Processo X consumindo recursos
Solução: Reiniciar processo X e investigar memory leak
Validação: Monitorar CPU por 30 min

Agora diagnostique este problema: [SEU CASO]"
```

### Para Configurações:
```
"Exemplo de configuração Docker:
# Configuração para aplicação web
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
EXPOSE 3000
CMD ["node", "server.js"]

Agora crie configuração similar para: [SUA APLICAÇÃO]"
```

### Para Documentação:
```
"Exemplo de procedimento:
## Backup de Banco de Dados
**Objetivo:** Criar backup seguro do PostgreSQL
**Pré-requisitos:** Acesso admin, espaço em disco suficiente
**Passos:**
1. Parar aplicações que usam o banco
2. Executar: pg_dump database_name > backup.sql
3. Validar backup: ls -la backup.sql
4. Reiniciar aplicações

Agora documente este procedimento: [SEU PROCESSO]"
```

### Para Otimização:
```
"Exemplo de análise de custo:
Recurso: t3.large (8760h/mês)
Uso Real: 40% CPU médio
Recomendação: Migrar para t3.medium
Economia: $45/mês (60% do custo atual)
Risk: Baixo - CPU suportado

Analise este recurso: [SEUS DADOS]"
```

---

## ESTRATÉGIAS AVANÇADAS

### 1. **Few-Shot Learning (Múltiplos Exemplos)**
```
"Veja estes 3 exemplos de como analisar métricas:

Exemplo 1: CPU 90% → Identificar processo → Otimizar ou escalar
Exemplo 2: Memory 95% → Verificar memory leaks → Reiniciar/configurar
Exemplo 3: Disk 85% → Limpar logs antigos → Expandir storage

Agora analise: Network 99% utilization"
```

### 2. **Exemplos Contrastivos (Certo vs Errado)**
```
"Exemplo BOM de commit message:
fix: resolve memory leak in user authentication
- Added proper cleanup of session objects
- Fixes issue #1234

Exemplo RUIM:
fixed stuff

Agora escreva commit message para: [SUA MUDANÇA]"
```

### 3. **Exemplos Progressivos**
```
"Exemplo Básico: 'Verificar logs'
Exemplo Melhor: 'Verificar logs de erro das últimas 2 horas'
Exemplo Ideal: 'Analisar logs de erro de /var/log/app.log das últimas 2 horas focando em padrões de memory allocation'

Agora melhore esta instrução: 'Monitorar sistema'"
```

---

## ERROS COMUNS

### ❌ O Que Evitar:

1. **Exemplos Muito Genéricos:**
```
❌ "Exemplo: Analise o problema e sugira solução"
```
*Problema:* Não demonstra padrão específico

2. **Exemplos Inconsistentes:**
```
❌ Exemplo 1: Formato A
    Exemplo 2: Formato B completamente diferente
```
*Problema:* IA fica confusa sobre qual padrão seguir

3. **Exemplos Irrelevantes:**
```
❌ Dar exemplo de análise de marketing para problema de infraestrutura
```
*Problema:* Não há transferência de conhecimento relevante

---

## COMO USAR BEM

### ✅ Práticas Inteligentes:

1. **Escolha Exemplos Representativos:**
```
✅ Use casos reais similares ao que você precisa
✅ Demonstre complexidade equivalente
✅ Mantenha contexto relevante
```

2. **Seja Consistente no Padrão:**
```
✅ Todos exemplos seguem mesma estrutura
✅ Mesmo nível de detalhamento
✅ Formato padronizado
```

3. **Combine com Outros Princípios:**
```
✅ Give Direction + Specify Format + Provide Examples
✅ "Analise este log (direção) em formato tabela (formato) 
    seguindo este exemplo (exemplo)"
```

---

## CONCLUSÃO

### Principais Takeaways:

1. **Exemplos Eliminam Ambiguidade**
   - Mostram exatamente o que você quer
   - Reduzem interpretações incorretas
   - Aceleram chegada ao resultado desejado

2. **Qualidade do Exemplo = Qualidade da Resposta**
   - Exemplos ruins geram respostas ruins
   - Exemplos específicos geram respostas específicas
   - Exemplos bem estruturados geram respostas organizadas

3. **Combine Exemplos com Outros Princípios**
   - Direction + Format + Examples = resultado ideal
   - Cada princípio potencializa os outros
   - Uso isolado é menos eficaz

### Regra Prática:

**Quando a IA não entende o que você quer, pergunte-se:**
"Posso mostrar um exemplo do que estou esperando?"

### Próximos Passos:
- **Próxima Aula:** Evaluate Quality - como avaliar se resultado está bom
- **Prática:** Adicione exemplos aos seus prompts mais usados
- **Mindset:** Um bom exemplo vale mais que mil explicações

---

**Duração Estimada:** 5 minutos  
**Conceito Chave:** Exemplos mostram padrões que IA deve seguir  
**Resultado:** Comunicação mais precisa e resultados consistentes