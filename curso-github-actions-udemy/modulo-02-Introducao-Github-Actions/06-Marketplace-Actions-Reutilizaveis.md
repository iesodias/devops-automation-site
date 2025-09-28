---
id: marketplace
title: "Marketplace com Milhões de Actions Reutilizáveis"
---

# Marketplace com Milhões de Actions Reutilizáveis

## Introdução
O Marketplace do GitHub Actions oferece um ecossistema massivo de componentes reutilizáveis que aceleram pipelines: checkout de código, setup de linguagens, build, testes, análise, containerização e deploy. Esta aula foca no uso estratégico, seleção e governança de actions públicas. Os fundamentos de o que é uma action (tipos, anatomia, inputs/outputs) já foram apresentados na aula "O que são Actions" e não serão repetidos aqui.

## Definição
O GitHub Marketplace para Actions é um catálogo público (com suporte a consumo controlado em organizações) onde mantenedores publicam ações versionadas para reutilização ampla. Ele viabiliza aceleração e padronização operacional ao permitir compor workflows com blocos validados pela comunidade. Referências imutáveis (`@tag`, SHA) sustentam reprodutibilidade.

## Explicação Técnica
### Resolução e Referenciamento
O runner baixa o código da action a partir da referência `owner/repo@ref` (tag, branch ou SHA) e executa conforme `action.yml`. Para segurança e previsibilidade: preferir tag principal estável (`@v4`) ou SHA fixo em cenários regulados. Evitar branches mutáveis (`@main`) em produção.

### Benefícios Principais
- Velocidade: reduz código repetitivo (ex: configuração de linguagem em uma linha).
- Confiabilidade: ações populares são amplamente testadas em múltiplos cenários.
- Especialização: encapsulam integrações complexas (cloud, containers, segurança).
- Evolução: manutenção e atualizações delegadas ao mantenedor original.
- Padrões: promovem consistência entre repositórios.

### Riscos e Mitigação
- Cadeia de fornecimento (ação comprometida) → Revisar fonte e fixar SHA quando necessário.
- Ruptura em major update → Validar em branch isolada antes de adotar nova major.
- Abuso de ações genéricas → Criar actions internas para regras corporativas (nomeação, políticas).
- Latência desnecessária → Remover encadeamentos redundantes e habilitar cache (quando suportado).

### Critérios de Seleção
- Popularidade/engajamento (downloads, estrelas, uso em projetos relevantes).
- Atualizações ativas e resposta a issues.
- Documentação clara de inputs/outputs e exemplos.
- Política de versionamento (tags previsíveis, changelog).
- Saúde de dependências (sem libs obsoletas ou scripts ofuscados).

### Quando Criar Action Própria (Contexto Marketplace)
Justifica internalizar quando há repetição em vários repositórios, políticas corporativas a encapsular, integração proprietária ou combinação recorrente (ex: setup + lint + notificação). Composite é porta de entrada; JS/Docker quando há lógica ou dependências nativas.

### Governança Organizacional
Manter catálogo interno aprovado; exigir revisão de segurança para introdução externa; padronizar política de versões; validar actions internas com pipeline (lint + scan). Registrar lista aprovada reduz ambiguidades.

## Exemplo Prático
Pipeline que combina actions externas populares e composite interna (a lógica de criação da composite foi explicada previamente na aula de fundamentos):

```yaml
name: Build and Scan
on: [push, pull_request]

jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Tests
        run: npm test -- --ci

      - name: Upload Coverage
        uses: codecov/codecov-action@v4
        with:
          fail_ci_if_error: true

      - name: Security Scan (Dependabot Metadata)
        uses: dependabot/fetch-metadata@v2
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}

      - name: Container Build & Push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: false
          tags: my-app:ci

      - name: Corporate Quality Gate
        uses: ./.github/actions/quality-gate  # Composite interna
        with:
          min-coverage: '80'
          lint-level: 'strict'
```

Composite interna (`.github/actions/quality-gate/action.yml`):

```yaml
name: Quality Gate
runs:
  using: 'composite'
  steps:
    - run: npm run lint
    - run: npm run coverage:check -- --min=$MIN
      env:
        MIN: ${{ inputs.min-coverage }}
    - run: echo "Qualidade validada"
inputs:
  min-coverage:
    required: true
  lint-level:
    required: false
```

### Comparação: Sem Action vs Com Action
Instalar e configurar Node + cache de dependências manualmente demanda vários passos shell. Usando `actions/setup-node` isso é abstraído em uma única linha.

Sem action (trecho simplificado):
```yaml
steps:
  - name: Baixar código
    run: git clone ${{ github.server_url }}/${{ github.repository }} .
  - name: Instalar Node manualmente
    run: |
      curl -fsSL https://nodejs.org/dist/v20.11.1/node-v20.11.1-linux-x64.tar.xz -o node.tar.xz
      tar -xf node.tar.xz
      mv node-v20.11.1-linux-x64 /opt/node
      echo "/opt/node/bin" >> $GITHUB_PATH
  - name: Gerar chave de cache
    id: cache-key
    run: echo "KEY=node-${{ hashFiles('package-lock.json') }}" >> $GITHUB_OUTPUT
  - name: Restaurar cache (exemplo conceitual)
    run: echo "(Implementar lógica própria de cache)"
  - name: Instalar dependências
    run: npm ci
```

Com action:
```yaml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
    with:
      node-version: 20
      cache: npm
  - run: npm ci
```

Construção e push de imagem container sem action vs usando `docker/build-push-action`:

Sem action (forma direta):
```yaml
steps:
  - run: docker build -t my-app:ci .
  - run: docker login -u ${{ secrets.REGISTRY_USER }} -p ${{ secrets.REGISTRY_PASS }} registry.example.com
  - run: docker tag my-app:ci registry.example.com/team/my-app:ci
  - run: docker push registry.example.com/team/my-app:ci
```

Com action:
```yaml
steps:
  - uses: docker/build-push-action@v5
    with:
      context: .
      push: true
      tags: registry.example.com/team/my-app:ci
```

Principais reduções:
- Menos linhas e menor superfície para erros repetitivos.
- Cache e autenticação encapsulados onde suportado.
- Atualizações e correções propagadas pelos mantenedores das actions.
- Foco no objetivo (testar, construir, publicar) em vez de detalhes operacionais.

## Conclusão
Marketplace é catalisador de velocidade e padronização, desde que combinado com seleção criteriosa, controle de versão disciplinado e governança de segurança. Diferenças conceituais de tipos e anatomia de actions residem na aula anterior; aqui o foco permanece em avaliar, integrar e sustentar um portfólio saudável. Evolução natural: estabelecer pipeline de validação automatizada para novas actions externas e métricas de adoção interna.
