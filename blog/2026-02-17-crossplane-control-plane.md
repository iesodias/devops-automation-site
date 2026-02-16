---
slug: crossplane-control-plane-platform-engineering
title: "Crossplane: Como Transformar o Kubernetes no Control Plane da Sua Infraestrutura"
description: "Entenda o Crossplane de forma prática: Providers, Compositions, Claims e como habilitar self-service com governança em uma IDP com Backstage e ArgoCD."
authors: [Ieso]
tags:
  - "platform engineering"
  - "internal developer platform"
  - "crossplane backstage argocd"
  - "infraestrutura como código"
  - "automação devops"
  - "golden paths self-service"
date: 2026-02-17
---

# Crossplane: Como Transformar o Kubernetes no Control Plane da Sua Infraestrutura

Quarta-feira, duas da tarde. Um time de desenvolvimento precisa de um banco PostgreSQL e um bucket para logs. O tech lead faz o que toda empresa “normal” faz: abre um chamado (ou uma solicitação) para infraestrutura. O pedido entra na fila, alguém pega quando dá, provisiona do jeito que lembra, copia credenciais num comentário e segue a vida.

No dia seguinte, o desenvolvedor descobre que o banco veio sem criptografia. Em outro ambiente, veio com uma versão diferente. Em produção, alguém abre o console “só para ajustar um detalhe” e ninguém documenta. Você não está lidando com falta de boa vontade. Está lidando com um modelo operacional que não escala.

<!-- truncate -->

> **Quer construir uma IDP completa na prática?** O curso [Engenharia de Plataforma: Do Conceito à Plataforma Interna](https://www.udemy.com/course/engenharia-de-plataforma-do-conceito-a-plataforma-interna/?referralCode=1F85049179AB40CC0D96) ensina a construção de uma Internal Developer Platform com **Crossplane, Backstage e ArgoCD**, do zero à implementação funcional.

Esse “balcão de pedidos” vira um gargalo por um motivo simples: infraestrutura não é só provisionamento. É provisionamento + padrão + governança + manutenção do estado ao longo do tempo. E a maioria das empresas tenta resolver isso com duas coisas que ajudam, mas não fecham o ciclo:

- Uma ferramenta de IaC que roda em pipeline ou na máquina de alguém.
- Um time de plataforma atuando como operador humano.

O Crossplane entra quando você decide mudar o jogo: em vez de tratar infraestrutura como execução de comandos, você passa a tratá-la como um serviço governado por uma API.

## Do comando para o Control Plane

Por anos, a operação de infraestrutura foi centrada em execução: alguém roda um `terraform apply`, alguém aplica um playbook, alguém clica no console. Funciona. Até parar de funcionar.

O motivo é que esse modelo é pontual. Ele descreve “como criar”, mas não garante “como permanecer”. Se um parâmetro muda, se alguém mexe manualmente, se uma política corporativa evolui, o estado real diverge do estado desejado. Esse desvio é o famoso configuration drift.

O Crossplane adota outra lógica. Ele pega o que o Kubernetes faz melhor — reconciliação — e leva para infraestrutura externa. Se o Kubernetes tem controladores garantindo “quero 3 réplicas e vou manter 3 réplicas”, o Crossplane faz o mesmo para recursos cloud: “quero esse banco com essas propriedades e vou manter essas propriedades”.

Isso parece detalhe, mas muda o papel do time de plataforma:

- Menos execução manual.
- Mais desenho de produtos internos (abstrações) que os times consumem.
- Governança aplicada pelo design, não pela fila de chamados.

Em vez de “rodar um script”, você “declara um estado”. E o Crossplane fica rodando, reconciliando.

Se você guardar só uma frase: Crossplane é mais parecido com o Kubernetes do que com o Terraform.

## O que é Crossplane, sem mistério

Crossplane é um projeto open-source que transforma o Kubernetes em um Control Plane para infraestrutura e serviços gerenciados. Na prática, ele adiciona novos tipos de recursos na API do cluster, e controladores que traduzem esses recursos em chamadas para a nuvem.

O resultado final é que, para o cluster, “um banco na AWS” vira só mais um recurso Kubernetes. Não porque ele está rodando no cluster, mas porque ele é administrado pelo cluster.

Essa diferença é importante: o Crossplane não é uma forma diferente de criar YAML. Ele é uma forma diferente de operar.

## Os quatro blocos que você precisa entender

Para o texto ficar claro, eu gosto de explicar Crossplane como quatro camadas, do “baixo nível” ao “produto”.

### 1) Providers: o conector com a nuvem

Provider é o pacote que ensina o Crossplane a falar com um conjunto de APIs (AWS, Azure, GCP e outros). Ele define os recursos gerenciados disponíveis e os controladores que vão reconciliar esses recursos.

Na operação real, aqui moram decisões que quase ninguém coloca no slide:

- Qual conta/projeto vai ser usada para provisionar?
- Quais permissões mínimas o provider vai ter?
- Como você faz rotação de credencial sem quebrar tudo?

Se você errar nessa camada, o Crossplane vira um “admin do cloud” disfarçado.

### 2) Managed Resources: o 1:1 da nuvem

Managed Resources são representações bem próximas do recurso cloud (um bucket, uma fila, um banco). É o nível onde você consegue fazer praticamente tudo, mas com uma consequência: fica verboso, e fica fácil demais expor complexidade para quem não deveria lidar com ela.

Esse nível é ótimo para o time de plataforma construir as abstrações. É ruim como interface direta para desenvolvedores.

### 3) XRDs: a API interna da sua plataforma

Composite Resource Definition (XRD) é quando você diz: “a partir de hoje, dentro da empresa, existe o conceito de BancoDeDadosPadrao”.

Repara no que muda: você sai do vocabulário da AWS/Azure/GCP e entra no vocabulário do negócio e da governança.

Um XRD bem desenhado é quase um contrato social. Ele limita o que pode ser pedido e torna explícito o que a plataforma oferece.

### 4) Compositions e Claims: o produto consumível

Composition é a implementação do XRD: quais recursos são criados, como eles se conectam, quais políticas são aplicadas, quais tags são obrigatórias, quais defaults existem.

Claim é a interface simples que o desenvolvedor usa. Em vez de configurar 40 campos, ele escolhe 4 ou 5 coisas relevantes: nome, tamanho, ambiente, versão.

O time de plataforma fica responsável por fazer a Composition “segura por padrão”. O dev só consome.

O detalhe que deixa isso realmente operacional é que o Crossplane consegue publicar connection details: endpoint, usuário/senha, certificados. Em geral, isso vira uma Secret no próprio Kubernetes. E aí a coisa fecha: o mesmo sistema que cria o recurso também entrega como a aplicação se conecta.

É nesse ponto que o self-service deixa de ser “peça a infra e depois alguém te manda a senha no chat”.

## Por que isso é diferente de “rodar Terraform em pipeline”

Eu gosto de colocar a comparação em uma pergunta prática: quando alguém muda um parâmetro na nuvem sem avisar, o que acontece?

Com um fluxo clássico de IaC, normalmente a resposta é: nada, até alguém rodar de novo. Em muitos lugares, esse “alguém” é um engenheiro específico, e o “de novo” pode demorar.

Com Crossplane, a expectativa é outra: o Control Plane está continuamente reconciliando. Você não depende de um ciclo humano para perceber que o estado mudou.

Isso não torna o Terraform obsoleto. Terraform é excelente para fundação (criar redes, clusters, contas, baseline). Crossplane é excelente quando você quer transformar recursos em catálogo consumível, com governança, dentro de um fluxo GitOps.

## Crossplane vs Terraform: quando cada um faz sentido

| Critério | Terraform | Crossplane |
|----------|-----------|------------|
| Modelo | Linha de Comando (CLI) | Control Plane (Kubernetes) |
| Estado | Arquivo estático (tfstate) | Armazenado no etcd do Kubernetes |
| Execução | Pontual (Apply) | Contínua (Reconciliação) |
| Drift | Detectado no próximo apply | Corrigido automaticamente em tempo real |
| API | HCL proprietário | API Kubernetes (YAML/JSON) |
| Integração | CI/CD Pipelines | GitOps (ArgoCD/Flux) |

O que quase ninguém fala é que “Crossplane vs Terraform” é uma discussão ruim quando vira torcida. Na prática, muita empresa usa os dois.

- Terraform para preparar o terreno (contas, redes, clusters, permissões).
- Crossplane para entregar produtos internos de infraestrutura (bancos, filas, buckets) como self-service.

O problema que o Crossplane resolve não é “como criar um bucket”. É “como permitir que dezenas de times criem buckets com padrão corporativo sem abrir chamado e sem virar administrador da nuvem”.

## Integração na IDP: O Elo Perdido

Se você está construindo uma IDP, a arquitetura que costuma funcionar bem é separar responsabilidades:

- Backstage: experiência do dev (catálogo, templates, jornada)
- ArgoCD: entrega (GitOps, auditoria, rollback)
- Crossplane: provisão e governança (infra como API)

Imagine um fluxo simples e realista:

1.  O desenvolvedor acessa o **Backstage** e escolhe um template "Novo Microsserviço Spring Boot".
2.  O Backstage gera o repo e inclui um pedido de infraestrutura (um Claim) para banco e storage.
3.  O código é enviado para o Git.
4.  O **ArgoCD** detecta a mudança e aplica o manifesto no cluster Kubernetes.
5.  O **Crossplane** vê o Claim, seleciona a Composition adequada (dev/staging/prod) e cria os recursos na nuvem.
6.  Quando está pronto, o Crossplane publica os detalhes de conexão em uma Secret.
7.  A aplicação sobe, consome a Secret e conecta.

Se você olhar com cuidado, o ponto forte não é “infra rápida”. É infra padronizada e governada sem depender de gente.

O time de plataforma ganha um lugar único para codificar padrões (a Composition). O time de dev ganha uma interface simples (Claim). E a organização ganha auditoria via Git.

## O que dá para padronizar de verdade

Quando você começa a pensar em Crossplane como produto interno, surgem “produtos” comuns:

- Banco com criptografia e backup obrigatórios.
- Bucket com política de retenção e tags de custo.
- Fila com limites e DLQ padrão.
- Cache com tamanhos pré-aprovados.

O objetivo não é limitar o desenvolvedor “porque sim”. É limitar porque governança precisa ser repetível. Se cada time cria do seu jeito, você não tem padrão. Você tem sorte.

## Multi-tenancy e segurança: onde a conversa fica séria

Se você quer self-service, você precisa responder: o que impede um time de pedir um recurso caro, ou de criar algo fora do padrão?

Crossplane ajuda, mas não resolve sozinho. O desenho costuma envolver:

- Namespaces e RBAC para limitar quem pode criar Claims.
- XRDs com schema restrito para evitar “escape hatches”.
- Compositions que forçam defaults e ignoram campos perigosos.
- Políticas de admissão (por exemplo, Gatekeeper/Kyverno) para impedir recursos fora do catálogo.

Isso é o que separa uma plataforma de um “kubernetes com poderes na AWS”.

## Os Desafios Reais

Assim como no Backstage, o Crossplane não é “instala e esquece”. Ele muda o modelo operacional, então traz novas dores.

O primeiro desafio é a curva de aprendizado. Se o time não tem intimidade com Kubernetes (CRDs, controllers, eventos, RBAC), o troubleshooting vai parecer magia negra.

O segundo desafio é design de API. Criar um XRD bom é parecido com criar um produto: você precisa pensar em experiência do usuário, limites, versões e compatibilidade. Se você expõe campos demais, você só trocou HCL por YAML. Se expõe campos de menos, os times vão bypassar a plataforma.

O terceiro desafio é operação do próprio Crossplane. Você precisa de logs, alertas e métricas dos controladores. Sem isso, a primeira falha vira “não sei por que o banco não nasceu”.

Além disso, a maturidade dos Providers varia. Em certos serviços, você vai sentir gaps. Isso não é motivo para abandonar a ideia, mas é motivo para ter uma estratégia híbrida quando necessário.

Por fim, existe o custo de plataforma. Para time pequeno, pode ser pesado manter tudo isso. E isso é ok: nem toda empresa precisa de uma IDP complexa.

## Como começar sem se perder

Se você quer testar Crossplane com chance real de sucesso, comece pequeno e com foco:

1. Escolha um produto interno que gera chamado toda semana (geralmente banco ou bucket).
2. Defina um XRD simples, com poucos campos.
3. Faça uma Composition “segura por padrão” para um único ambiente.
4. Integre com GitOps para virar fluxo repetível.
5. Só depois expanda.

Plataforma não se faz com anúncio. Se faz com um Golden Path que funciona melhor do que o jeito antigo.

## Conclusão

Crossplane é uma forma prática de transformar infraestrutura em produto interno: consumível por API, governado por padrão e operado com reconciliação contínua.

Ele não existe para deixar YAML bonito. Ele existe para tirar o time de plataforma da posição de balcão de pedidos e colocar esse time na posição de fabricante de padrões.

Se sua empresa vive afogada em chamados de infraestrutura e já tem Kubernetes como base, o Crossplane é um caminho bem sério para resolver a dor na raiz — com governança embutida.


> **Quer ver isso funcionando?** No curso [Engenharia de Plataforma: Do Conceito à Plataforma Interna](https://www.udemy.com/course/engenharia-de-plataforma-do-conceito-a-plataforma-interna/?referralCode=1F85049179AB40CC0D96), implementamos exatamente essa arquitetura, integrando o Crossplane como motor de infraestrutura por trás do portal Backstage.
