---
id: secrets
title: "Secrets & Variáveis no GitHub Actions"
---

# Secrets & Variáveis no GitHub Actions

## Introdução
Ao automatizar processos com GitHub Actions surgem duas necessidades distintas: (a) armazenar credenciais ou valores sensíveis com segurança; (b) parametrizar execuções com valores não sensíveis que podem mudar por ambiente ou contexto. Para isso a plataforma oferece "Secrets" e "Variables". Entender diferenças, escopos, resolução e boas práticas evita vazamentos, acoplamento excessivo e comportamento inesperado em workflows.

## Definição
- Secrets: valores sensíveis (tokens, chaves API, senhas) criptografados e nunca exibidos em claro na interface ou logs. Disponibilizados apenas em tempo de execução do workflow que possui permissão de leitura deles. São mascarados quando impressos.
- Variables (Actions variables): valores não sensíveis (ex: NOME_APLICACAO, REGIAO_PADRAO) usados para parametrização estável. Podem ser definidos em repositório, ambiente (environment) ou organização.
- Environment variables (env): variáveis definidas diretamente no YAML (`env:`) ou em steps. Não são criptografadas. Podem referenciar secrets e variables.

## Explicação Técnica
### Escopos e Hierarquia
Secrets e variables podem existir em múltiplos níveis:
- Repositório: visíveis apenas naquele repositório.
- Ambiente (Environment): associados a um environment (ex: staging, production); só expostos a jobs que referenciem explicitamente o environment.
- Organização: reutilizáveis em vários repositórios (respeitando políticas de acesso/seleção de repositórios permitidos).

Precedência típica de resolução dentro de um job (para variáveis com mesmo nome):
1. Variável definida diretamente em `env` no step.
2. Variável definida em `env` no job.
3. Variável definida em `env` no nível do workflow.
4. Actions variable em Environment.
5. Actions variable em Repositório.
6. Actions variable em Organização.
(Secrets não fazem shadow de variáveis; são acessados explicitamente via `secrets.NOME`).

### Acesso em Workflow
- Secret: `${{ secrets.MEU_TOKEN }}`
- Variable: `${{ vars.NOME_APLICACAO }}` (alias moderno `vars` para GitHub Actions variables)
- Env local: `${{ env.NOME }}` ou `$NOME` (dependendo do shell)

### Ciclo de Vida e Segurança
- Secrets: criptografia em repouso; não podem ser listados em claro; substituição (rotacionar) exige sobrescrever valor; removidos deixam de estar acessíveis imediatamente; mascaramento automático nos logs (strings longas podem exigir cuidados se fragmentadas ou se o output gerar transformações).
- Variables: valores exibidos em claro na interface; úteis para evitar repetição de literais; não devem conter credenciais.

### Política de Forks
Workflows disparados de forks em repositórios públicos não recebem automaticamente secrets do repositório pai, exceto em casos de permissões controladas (ex: pull requests de forks não têm acesso à maioria dos secrets por padrão). Isso reduz risco de exfiltração via execução maliciosa.

### Boas Práticas (Resumo)
- Minimizar escopo: secrets de produção em Environment específico + aprovação manual se necessário.
- Rotação periódica: sincronizar com política de expiração do provedor externo.
- Não reutilizar a mesma chave para múltiplos sistemas.
- Evitar eco direto em shell: se precisar depurar, criar hash parcial.
- Segregar por finalidade: ex: `DOCKER_REGISTRY_TOKEN`, `API_BACKEND_KEY`, `SLACK_WEBHOOK_URL`.
- Usar `permissions:` mínimos no workflow para reduzir impacto caso secret seja comprometido.

### Limitações Comuns
- Tamanho máximo por secret (documentação oficial deve ser consultada se mudar limite).
- Secrets não suportam interpolação dinâmica dentro do arquivo antes da execução; resolução acontece em runtime do expression engine.
- Não há como recuperar o valor original via API; apenas sobrescrever.

### Interação com Environments
Environments podem exigir aprovações ou proteger secrets sensíveis (ex: `PROD_DB_PASSWORD`). O job que especifica `environment: production` só acessa aqueles secrets após cumprir regras (aprovação manual ou tempo de espera). Isso cria barreira adicional antes de deploy crítico.

### Erros e Armadilhas Frequentes
- Esquecer de referenciar environment -> secrets daquele environment não aparecem.
- Concatenação que divide secret em pedaços pode desmascarar padrões parciais.
- Uso de `echo ${{ secrets.MEU_TOKEN }}` em plain log sem necessidade.
- Confundir `secrets` com `vars` e tentar alterar secret dentro do workflow (não suportado; secrets são somente leitura em runtime).

## Exemplo Prático
Workflow demonstrando uso coordenado de secrets e variables:
```yaml
name: Build Parametrizado
on: [push]

permissions:
  contents: read

env:
  REGIAO_DEFAULT: us-east-1

jobs:
  build:
    runs-on: ubuntu-latest
    environment: staging
    steps:
      - uses: actions/checkout@v4
      - name: Mostrar parâmetros
        run: |
          echo "Aplicação: ${{ vars.NOME_APLICACAO }}"
          echo "Região default: $REGIAO_DEFAULT"
      - name: Usar secret em chamada de API
        run: |
          curl -H "Authorization: Bearer ${{ secrets.API_BACKEND_KEY }}" https://api.exemplo.local/status || true
      - name: Exportar variável derivada
        run: echo "ENDPOINT=https://api.${{ vars.DOMINIO_BASE }}" >> $GITHUB_ENV
      - name: Consumir variável derivada
        run: echo "Endpoint calculado: $ENDPOINT"
```
Pré-condições:
- Definir em repositório: Variables `NOME_APLICACAO`, `DOMINIO_BASE`.
- Definir em Environment `staging`: Secret `API_BACKEND_KEY`.

## Conclusão
Secrets e variables cumprem papéis complementares: segurança para credenciais x parametrização transparente não sensível. Separar usos evita exposição acidental e melhora manutenção. Dominar escopos, precedência e interação com environments permite aplicar princípio do menor privilégio de forma prática. A seguir, pode-se evoluir para: política de rotação, diferenciação detalhada `GITHUB_TOKEN` vs secrets personalizados ou estratégias de validação de integridade antes de deploy. Indique a próxima prioridade.
