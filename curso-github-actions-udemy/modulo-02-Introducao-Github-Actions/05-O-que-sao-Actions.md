# O que são Actions

id: actions
title: O que são Actions?
---

# O que são Actions
## Introdução
Actions são blocos reutilizáveis de automação que você combina em steps para formar workflows. Elas encapsulam tarefas frequentes (checkout, setup de linguagem, build, teste, scan, deploy) reduzindo repetição e padronizando práticas. Entender estrutura, tipos, versionamento e quando criar uma action própria evita reinvenção e aumenta consistência operacional.

## Definição
Uma action é uma unidade versionada de execução declarativa consumida via `uses:` dentro de um step. Fornece interface (inputs), produz resultados (outputs), pode definir variáveis de ambiente e roda dentro de um job. Três tipos principais:
- JavaScript: executada diretamente no runner (Node.js). Menor latência, acesso direto ao filesystem e à API.
- Docker: executa dentro de container construído/fornecido, isolando dependências. Útil para toolchains específicos.
- Composite: encadeia outros steps (comandos e/ou outras actions) em um pacote declarativo, simplificando repetição.

## Explicação Técnica
### Anatomia Básica
Arquivo principal: `action.yml` (ou `action.yaml`) contendo metadados: `name`, `description`, `inputs`, `outputs`, `runs`. O consumo se dá por `owner/repo@ref` onde `ref` pode ser tag (ex: `v4`), branch ou SHA imutável (preferível para maior segurança).

### Inputs e Outputs
- Inputs são declarados com `required`, `default` e acessados via variáveis de ambiente ou `core.getInput()` (JS). 
- Outputs permitem encadear dados para steps subsequentes: definidos pela action e consumidos em `${{ steps.id.outputs.saida }}`.

### Tipos em Detalhe
- JavaScript: define `runs.using: node20` (ou versão suportada). Empacota dependências (idealmente com lockfile) ou vendora código para minimizar instalação em runtime.
- Docker: define `runs.using: docker` e `image: Dockerfile` (ou imagem externa). Adequado quando ferramenta exige binários nativos específicos.
- Composite: `runs.using: composite` e lista `steps:` internos; não introduz runtime diferente, apenas reutiliza.

### Diferença Action vs Step
- Step: instrução atômica em um job (`run:` ou `uses:`). 
- Action: elemento referenciado por steps (`uses:`) que encapsula lógica reutilizável.

### Versionamento e Referências
Boas práticas:
- Preferir tags de versão principal estável (`@v4`) para receber correções não disruptivas.
- Em ambientes de compliance estrito: fixar SHA (`@<commit_sha>`).
- Evitar uso de branch mutável (`@main`) em produção.

### Segurança
- Revisar fonte antes de introduzir action nova (especialmente Docker).
- Fixar ref confiável (tag imutável assinada ou SHA) para prevenir supply chain hijack.
- Restringir permissões do `GITHUB_TOKEN` via `permissions:` reduzindo impacto.
- Atualizar periodicamente para patches (dependabot pode sinalizar).

### Performance
- Ações JavaScript executam mais rapidamente (sem build de container).
- Docker adiciona tempo de build/pull; usar cache de camadas quando possível.
- Composite evita múltiplos steps redundantes e melhora legibilidade.

### Quando Criar Action Própria
Criar uma action (JS ou Docker) quando:
- Requer integração complexa com API ou manipulação avançada (ex: geração de relatório com parsing).
- Dependências precisam de isolamento (bibliotecas nativas, ferramentas específicas).
Preferir Composite quando:
- Apenas agrupa sequência de comandos e outras actions já existentes.
- Deseja padronizar convenções (lint + teste + notificação) sem lógica customizada sofisticada.

### Estrutura Simplificada de `action.yml`
```
name: Setup Ferramenta X
description: Instala e configura Ferramenta X
inputs:
  version:
    description: Versão desejada
    required: false
    default: 'latest'
runs:
  using: node20
  main: dist/index.js
```

### Outputs (Exemplo Conceitual)
Action define saída no JavaScript usando `core.setOutput('artifact-path', caminho)`. No workflow:
```
- name: Usar action
  id: setup
  uses: org/setup-ferramenta@v1
  with:
    version: 2.1.0
- name: Consumir output
  run: echo "Path: ${{ steps.setup.outputs.artifact-path }}"
```

### Publicação e Reuso Interno
- Publicar: repositório dedicado ou monorepo com diretório claro.
- Taggear versões (`git tag v1.2.0 && git push origin v1.2.0`).
- Manter changelog para facilitar upgrades.

## Exemplo Prático
Workflow combinando actions do Marketplace e composite interna:
```yaml
name: Exemplo Actions
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Instalar
        run: npm ci
      - name: Testar
        run: npm test -- --ci
      - name: Qualidade Interna
        uses: ./.github/actions/qualidade  # composite local
        with:
          cobertura-minima: '80'
```
Composite interna (`.github/actions/qualidade/action.yml`):
```
name: Qualidade
runs:
  using: composite
  steps:
    - run: npm run lint
    - run: npm run coverage:check -- --min=${{ inputs.cobertura-minima }}
inputs:
  cobertura-minima:
    required: true
```

## Conclusão
Actions elevam abstração dos workflows: encapsulam tarefas em unidades versionadas, promovem reuso, segurança e padronização. Escolher tipo adequado (JavaScript, Docker, Composite), versionar de forma previsível e aplicar princípios de menor privilégio reduz riscos e custo de manutenção. Criar actions apenas quando agrega valor além de simples agrupamento mantém o ecossistema enxuto e escalável. Próximo passo natural: aprofundar em criação de composite própria ou controle de permissões e caching estratégico.
