---
id: cd
title: Continuous Deployment (CD)
noindex: true
---

# Continuous Deployment (CD)

<div align="center">
  <img src="/img/github-actions/ci.png" alt="DevOps Logo" width="800"/>
</div>

## Introdução
Implantação Contínua leva o conceito de fluxo contínuo além da Integração Contínua: cada mudança que passa por todas as verificações automatizadas segue para produção sem intervenção manual. O objetivo não é implantar mais “por implantar”, mas reduzir o tempo entre código aprovado e valor disponibilizado ao usuário, mantendo controle rigoroso de risco por meio de automação, telemetria e estratégias de liberação graduais.

## Definição
Implantação Contínua é a prática em que o fluxo, após validar qualidade (construção, testes, segurança, conformidade), promove automaticamente artefatos aprovados até o ambiente de produção. Diferencia‑se da Entrega Contínua pelo fato de não exigir aprovação humana final rotineira: a decisão de liberar é automatizada e baseada em critérios objetivos. Maturidade exige testes confiáveis, infraestrutura reprodutível, observabilidade acionável e mecanismos de reversão rápidos.

## Explicação Técnica
Para viabilizar CD seguro, o pipeline precisa ter gates determinísticos e estágio de promoção controlada. Após a fase de integração e testes, o artefato imutável (imagem de container, pacote versionado) é assinado/versionado e armazenado. A promoção desencadeia sequência: provisionamento (ou atualização declarativa) do destino, execução de migrações, validações de saúde (health checks) e ativação gradual de tráfego.

Estratégias de liberação (selecionadas conforme contexto de risco):
- Azul-Verde (Blue-Green): dois ambientes idênticos; troca de rota reduz interrupção e facilita reversão imediata.
- Distribuição Gradual (Canário): pequena fração de tráfego vai primeiro para a nova versão; aumenta progressivamente sob métricas saudáveis.
- Alternância de Funcionalidades (Feature Flags): código em produção com recursos desativados até ativação seletiva; reduz necessidade de ramificações de longa duração.
- Entrega Progressiva: combinação de distribuição gradual e automação de reversão baseada em objetivos de nível de serviço (latência, erro, saturação).
- Execução Paralela Oculta (Dark Launch / Tráfego Sombra): processa tráfego de forma paralela (sem impactar resposta) para validar comportamento.

Automação de reversão é parte estrutural do desenho, não contingência improvisada. Critérios objetivos (ex: aumento > X% em taxa de erro, latência p95 acima de limite, consumo anômalo) disparam: interrupção da progressão gradual, volta para versão estável ou desativação de funcionalidade. Essa lógica pode residir em orquestradores, scripts de controle ou plataformas de implantação.

Prerequisitos técnicos fundamentais: alta cobertura de testes críticos, segregação clara entre testes rápidos (gate inicial) e validações mais profundas (por exemplo, testes de contrato ou de carga leve em ambiente pré-produção), infraestrutura como código para coerência entre ambientes, secrets gerenciados de forma central e versionamento explícito de artefatos.

Observabilidade é pilar de confiança. Registros estruturados facilitam correlação; métricas de negócio (taxa de conversão, uso de funcionalidade), além das técnicas (erro, latência, saturação), alimentam decisões automáticas ou alertas. Rastreio distribuído acelera diagnóstico de regressões de desempenho. Painéis em tempo quase real sustentam avaliação pós-implantação e ciclos de aprendizado.

Riscos comuns e mitigação: instabilidade de testes (intermitentes) gera falsos negativos/positivos — mitigado por isolamento e estabilização; implantação acoplando migração destrutiva — mitigado por padrões expandir/contrair; dependência externa sem versionamento — mitigado por simulação e contratos versionados; proliferação de alternâncias de funcionalidade — mitigado por política de expiração e limpeza.

Alavancas de maturidade incremental: iniciar com distribuição gradual manual + observabilidade básica; evoluir para gradual automatizada; adicionar avaliação contínua de objetivos de nível de serviço; incorporar reversão automática; finalmente introduzir entrega progressiva orientada a métricas de negócio.

## Exemplo Prático
Fluxo sintético: integração na ramificação principal gera imagem versionada (v2025.09.27.3) após passar por construção, testes e análise de segurança. Fluxo assina e publica a imagem no registro. Etapa de implantação inicia distribuição gradual direcionando 5% do tráfego via configuração do balanceador. Um processo de análise monitora por 5 minutos métricas (erro < 1%, latência p95 < 250ms, ausência de novos alertas críticos). Se saudável, escala para 25%, depois 50%, depois 100%. Durante a fase 25%, detector identifica aumento de erro para 3%; sequência dispara reversão automática retornando rota para versão anterior (v2025.09.27.2), gera anotação em painel e abre registro de acompanhamento com instantâneo de métricas. Investigação aponta mudança em serialização; correção aplicada gera nova construção que reinicia processo gradual com sucesso.

## Conclusão
Implantação Contínua reduz fricção entre aprovação e entrega real, transformando implantação em evento rotineiro e de baixo risco. Para atingir confiança operacional são indispensáveis: automação de promoção e reversão, artefatos imutáveis, estratégias graduais (azul‑verde, distribuição gradual, alternâncias de funcionalidade), observabilidade orientada a métricas técnicas e de negócio e disciplina em testes e infraestrutura declarativa. Quando bem implementada, acelera retorno de produção, reduz custo de oportunidade e libera a equipe para focar evolução de produto em vez de coordenação manual de liberações. Esse alicerce viabiliza camadas posteriores como experimentação controlada e otimização contínua baseada em impacto real.
