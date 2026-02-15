---
id: env-proc
title: "Environments e Proteções de Implantação"
---

# Environments e Proteções de Implantação

## Introdução

Environments organizam implantações por estágios (como dev, staging e prod), segregando variáveis e segredos e aplicando proteções antes de liberar o deploy. Usar environments corretamente ajuda a evitar exposições indevidas e cria um fluxo de promoção previsível com aprovações e janelas de espera.

## Definição

Um environment é um alvo lógico de implantação no GitHub que pode possuir variáveis, segredos e regras de proteção. Ao declarar um environment em um job, você habilita o acesso aos segredos daquele estágio e pode exigir aprovações manuais antes da execução. Também é possível definir uma URL de ambiente para sinalizar onde o sistema está disponível após o deploy.

Link oficial:
- Environments (gerenciamento e proteção): https://docs.github.com/pt/actions/deployment/targeting-different-environments/managing-environments-for-deployment

## Explicação Técnica

Você declara o environment no trabalho com `environment:`. Quando um environment possui regras de proteção, o trabalho entra em estado de “aguardando aprovação” até que um revisor autorizado libere a execução. Além disso, a configuração pode incluir um tempo de espera (wait timer), janelas de implantação e escopos de acesso aos segredos específicos daquele environment.

A segregação por environment permite que segredos e variáveis sejam diferentes por estágio, mantendo nomes consistentes e reduzindo erros. Por exemplo, `DATABASE_URL` pode ter valores distintos em `dev` e `prod`, mas o workflow referencia apenas `secrets.DATABASE_URL` após ativar o environment correto. A propriedade `environment` aceita também um campo `url`, permitindo apresentar um link clicável no resumo da execução para a aplicação implantada.

Boas práticas incluem criar environments com nomes claros (dev, staging, prod), exigir revisores apenas em ambientes sensíveis (como prod), restringir permissões de escrita e separar os jobs de build/test dos jobs de implantação. Sempre reveja quem pode aprovar e se os segredos estão realmente armazenados no environment e não no repositório de forma global.

## Exemplo

O exemplo a seguir demonstra um trabalho que usa um environment com URL e um gate de proteção por aprovação. É conceitual e compatível com executores Linux.

```yaml
name: Aula 20 — Environments e Proteções
on:
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: prod
      url: https://app.exemplo.com
    steps:
      - name: Preparar pacote
        run: |
          echo "Gerando artefatos de deploy..."
      - name: Usar segredos do environment (após aprovação)
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: |
          echo "Conectando ao banco com URL protegida (valor não impresso)"
          # Exemplo: ./deploy.sh --db "${DATABASE_URL}"
      - name: Finalizar
        run: |
          echo "Implantação concluída em ${GITHUB_REF_NAME:-branch}" 
```

Como funciona: ao iniciar o trabalho, caso o environment `prod` tenha revisores obrigatórios, a execução ficará em espera até a aprovação. Depois disso, os segredos do environment ficam disponíveis e podem ser consumidos com segurança nas etapas. A `url` definida no environment aparece no resumo da execução como o endereço da aplicação implantada.

## Conclusão

Environments trazem segregação de configuração por estágio e mecanismos de proteção como aprovações e janelas de espera. Declarar o environment diretamente no job libera segredos daquele estágio e permite exibir a URL do ambiente após o deploy. Com nomes padronizados, revisores definidos e segredos bem distribuídos, o pipeline fica mais seguro, auditável e fácil de operar.
