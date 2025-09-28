---
id: git-github
title: Git, GitHub & GitHub Actions
---

# Git, GitHub & GitHub Actions

## Introdução
Este conteúdo esclarece, de forma separada e direta, três elementos frequentemente confundidos: Git (ferramenta), GitHub (plataforma) e GitHub Actions (mecanismo de automação dentro da plataforma). Diferenciar escopo, responsabilidade e limites de cada um evita interpretações equivocadas, elimina sobreposição conceitual e prepara base sólida para compreender práticas de CI/CD.

<div align="center">
  <img src="/img/github-actions/git-github-ga.png" alt="DevOps Logo" width="500"/>
</div>

## Definição
- Git: sistema de controle de versão distribuído. Registra alterações em arquivos, permite criar linhas paralelas de desenvolvimento (branches), combinar mudanças (merge), inspecionar histórico e reverter estados. Cada cópia (clone) contém todo o histórico, garantindo independência e resiliência.
- GitHub: serviço hospedado que utiliza Git como motor de versionamento e adiciona camada colaborativa e de governança (repositórios remotos, permissões, pull requests, issues, segurança, integrações) acessível via interface web e APIs.
- GitHub Actions: recurso nativo do GitHub que executa automações (workflows) definidas em YAML e disparadas por eventos do repositório (push, pull_request, schedule, workflow_dispatch, entre outros), compondo o núcleo operacional de pipelines de integração e entrega contínuas.

## Explicação Técnica
### Git (Foco: Versionamento Distribuído)
Natureza: ferramenta instalada localmente (CLI) que manipula estrutura de objetos (commits, árvores, blobs, referências). Cada commit é um snapshot lógico que aponta para seu predecessor, formando um grafo acíclico (DAG) de histórico. Principais capacidades: isolamento de evolução via branches, integração controlada via merge ou rebase, inspeção (`git log`), marcação estável (tags), reversão (revert), reconstrução de estado (checkout). Git não gerencia permissões de acesso remoto, interface social, execução de automações ou hospedagem — ele apenas provê o mecanismo de versionamento.

### GitHub (Foco: Colaboração e Orquestração Social)
Amplia o Git adicionando: autenticação centralizada, controle de acesso, revisão estruturada (pull request), rastreamento de demanda (issues), gestão de discussões, segurança (dependabot alerts, code scanning), publicação de versões (releases), hospedagem de pacotes e visibilidade operacional (logs de execução de workflows). GitHub não altera o funcionamento interno do Git; oferece camada de integração, observabilidade e governança sobre repositórios que usam Git. Ele também provê APIs para automação externa e integrações com ecossistema (webhooks, aplicações, provedores de identidade, scanners de qualidade e segurança).

### GitHub Actions (Foco: Automação Baseada em Eventos)
Mecanismo interno do GitHub que observa eventos do repositório e dispara workflows. Arquivos de workflow residem em `.github/workflows/`. Estrutura: workflows -> jobs -> steps. Jobs executam em runners (máquinas efêmeras Linux, Windows ou macOS, ou instâncias self-hosted). Steps encadeiam ações reutilizáveis (actions) ou comandos diretos. Escopo típico: build, testes, análise estática, geração de artifacts, empacotamento, release, deploy condicionado, rotinas agendadas, validações de conformidade.

### Delimitação Clara de Responsabilidades
| Aspecto                  | Git                                   | GitHub                                                     | GitHub Actions                                        |
|--------------------------|----------------------------------------|------------------------------------------------------------|-------------------------------------------------------|
| Função central           | Versionamento distribuído              | Colaboração e gestão do repositório                       | Automação reativa e contínua                         |
| Onde existe              | Local (CLI) / qualquer servidor        | Serviço hospedado (nuvem)                                 | Dentro do GitHub                                      |
| Unidade principal        | Commit / branch / tag                  | Repositório / pull request / issue                        | Workflow / job / step                                 |
| Armazena histórico       | Sim (total)                            | Replica remoto + metadados colaborativos                  | Não (usa eventos e registra logs de execuções)        |
| Segurança de código      | Não (apenas história)                  | Sim (permissões, alertas, revisão)                        | Complementa (políticas via automação)                 |
| Execução de código       | Não                                    | Não diretamente (sem Actions)                             | Sim (em runners efêmeros ou self-hosted)              |
| Triggers de automação    | Não                                    | Disponibiliza eventos                                     | Consome e reage a eventos                             |

### O que Cada Um NÃO É
- Git não é plataforma de colaboração nem ambiente de execução.
- GitHub não substitui Git; depende dele para versionamento.
- GitHub Actions não é motor de versionamento nem substitui ferramentas de orquestração externa mais amplas (ex: sistemas de deploy multiambiente complexos); atua dentro do ciclo ligado ao repositório.

### Relação Integrada
1. Git fornece modelo e comandos para criar e manipular histórico.
2. GitHub provê local remoto confiável e colaborativo para esse histórico + processos de revisão e governança.
3. GitHub Actions observa mudanças e executa verificações/entregas automatizadas garantindo qualidade, consistência e cadência contínua.

## Exemplo Prático
Nesta aula o foco é conceitual. Em vez de um exemplo operacional, o quadro mental a reter é: Git (motor de histórico) → GitHub (plataforma colaborativa sobre esse histórico) → GitHub Actions (automação que reage a eventos desse histórico hospedado). Esse encadeamento sustenta práticas de CI/CD sem exigir infraestrutura própria inicial.

## Conclusão
Distinguir claramente os três papéis elimina confusão recorrente ("Git" ≠ "GitHub"; "GitHub" não automatiza nada sem "GitHub Actions"). Git é o núcleo de versionamento; GitHub adiciona colaboração, segurança e exposição organizada; GitHub Actions integra automação reativa e contínua acoplada ao ciclo de mudança. Com essa base consolidada, próximos tópicos como branching strategies, gatilhos (triggers) e otimização de workflows tornam-se mais intuitivos. Se quiser priorizar aprofundamento em um dos eixos (ex: anatomia de commits ou organização de workflows), sinalize para calibrarmos a sequência.
