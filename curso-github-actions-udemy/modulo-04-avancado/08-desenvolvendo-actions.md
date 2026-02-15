---
id: dev-actions
title: "Desenvolvendo Actions"
---

# Desenvolvendo Actions (JS, Docker e Ações Compostas)

## Introdução

Criar suas próprias actions permite padronizar fluxos e compartilhar lógica entre repositórios. Nesta aula, apresentamos os três tipos principais — JavaScript, Docker e Composite — e como definir metadados, inputs e outputs para publicação segura.

## Definição

Actions JavaScript executam código Node.js diretamente no executor, com inicialização rápida. Actions Docker empacotam um contêiner com dependências fixas, úteis quando o ambiente precisa ser controlado. Ações compostas combinam etapas `uses:` e `run:` em YAML, sem imagem própria, ideais para orquestrar comandos e ações existentes.

Links oficiais:
- Criando actions: https://docs.github.com/pt/actions/creating-actions
- Sintaxe de metadata: https://docs.github.com/pt/actions/creating-actions/metadata-syntax-for-github-actions

## Explicação Técnica

Toda action possui um arquivo de metadata (`action.yml` ou `action.yaml`) que declara `name`, `description`, `inputs`, `outputs` e `runs`. Em JavaScript, `runs: using: node20` aponta para o arquivo principal (por exemplo, `dist/index.js`). Em Docker, `runs: using: docker` referencia a imagem (local `Dockerfile` ou registry). Em action composta, `runs: using: composite` lista etapas com `shell` e `run`, podendo usar outras actions.

Inputs são acessados via `${{ inputs.<nome> }}` em composite e por APIs/utilitários no caso de JS/Docker. Outputs são emitidos escrevendo pares `chave=valor` em `GITHUB_OUTPUT`. Versione sua action com tags (`v1`, `v1.2.0`) e prefira pinning por SHA em consumidores críticos. Forneça README com exemplos e tabela de inputs/outputs.

Boas práticas: inclua testes, lint e release automation; evite requerer privilégios elevados; minimize superfícies de ataque (dependências e permissões). Documente limites e erros comuns com mensagens claras.

## Exemplo

Exemplo de action composta mínima (`action.yml`) e seu uso em um workflow, mostrando input e output simples.

```yaml
# action.yml (no repositório da action)
name: "Echo Name"
description: "Exibe uma saudação simples"
inputs:
  name:
    description: "Nome a exibir"
    required: false
    default: "Mundo"
outputs:
  message:
    description: "Mensagem gerada"
runs:
  using: "composite"
  steps:
    - id: make-msg
      shell: bash
      run: |
        MSG="Olá, ${{ inputs.name }}!"
        echo "message=${MSG}" >> "$GITHUB_OUTPUT"
```

Uso da action no workflow:

```yaml
name: Aula 26 — Demo Action
on: { workflow_dispatch: }

jobs:
  demo:
    runs-on: ubuntu-latest
    steps:
      - name: Usar action
        uses: my-org/echo-name@v1
        with:
          name: "Estudante"
      - name: Mostrar output
        run: |
          echo "Mensagem: ${{ steps.make-msg.outputs.message }}"
```

No exemplo, a action composta gera um output `message` via `GITHUB_OUTPUT` e o workflow consumidor imprime a mensagem. Em uma action JS, a lógica seria implementada em Node e referenciada no `action.yml`. Em Docker, a lógica viria na imagem definida.

## Conclusão

Escolha o tipo de action conforme a necessidade de ambiente e velocidade. Descreva metadados, inputs e outputs com clareza, publique versões estáveis e incentive pinning quando segurança é prioridade. Com isso, suas actions tornam-se reutilizáveis, previsíveis e fáceis de manter.
