---
id: github-token
title: Github Token
---

# Github Token

## Introdução
O `GITHUB_TOKEN` é um token de acesso temporário gerado automaticamente pelo GitHub para cada job de um workflow. Ele permite que automações interajam com a própria plataforma sem expor credenciais pessoais ou tokens PAT (Personal Access Token). Compreender seu comportamento, escopo e limitações é essencial para construir automações seguras e previsíveis.

## Definição
`GITHUB_TOKEN` é um segredo efêmero (installation access token de um GitHub App interno) emitido no início de cada job, com permissões associadas ao repositório onde o workflow está sendo executado. Expira ao final da execução do job (ou no máximo em 24h). Ele está disponível tanto como variável de ambiente quanto via contexto `github.token` dentro do workflow.

## Explicação Técnica
### Como é gerado
Ao habilitar GitHub Actions, um GitHub App é instalado no repositório. No início de cada job, GitHub solicita um installation access token desse App e o injeta no ambiente como `GITHUB_TOKEN`. O token é único por job e não reutilizável posteriormente.

### Escopo e Permissões
- Restringe-se ao repositório atual (não acessa outros repositórios exceto quando permissões e configurações específicas permitem via reutilização limitada, como checkout de submódulos públicos).
- As permissões padrão podem variar (lidas ou reduzidas) conforme configurações de organização ou repositório (ex: política “Workflow permissions”).
- Pode ser ajustado explicitamente em cada workflow usando a chave `permissions:` para princípio do menor privilégio.

Exemplo de restrição explícita:
```yaml
permissions:
  contents: read
  pull-requests: write
  issues: write
```

### Ciclo de Vida
- Criado: antes do primeiro step de cada job.
- Uso: autenticação em API, checkout de código, criação de pull request, comentários, atualização de status, escrita controlada.
- Expiração: ao término do job ou 24h (o que ocorrer primeiro).
- Revogação antecipada: reiniciar job gera novo token, invalidando o anterior.

### Evitando Loops Recursivos
Ações disparadas com este token não geram novos disparos de workflow para a maioria dos eventos (exceções notáveis: `workflow_dispatch`, `repository_dispatch`). Isso previne loops (ex: workflow que faz `git push` não dispara outro workflow de `push`). Commits feitos usando este token também não acionam build de GitHub Pages.

### Contexto e Acesso
- Disponível como variável de ambiente automática: `$GITHUB_TOKEN` (dependendo do runner/shell)
- Disponível via expressão: `${{ github.token }}`
- Não aparece em logs (mas tenha cuidado ao imprimir estruturas que contenham headers de autorização)

### Configuração de Permissões no Repositório
Em Settings > Actions > General > Workflow permissions: pode-se definir
- `Read and write permissions`
- `Read repository contents permission`
E opcionalmente habilitar: “Allow GitHub Actions to create and approve pull requests”. Ajustar isso altera o baseline das permissões iniciais do token.

### Por Que Usar `GITHUB_TOKEN` em Vez de PAT
- Rotação automática (sem gestão manual de expiração)
- Escopo mínimo pré-definido
- Menor risco em caso de vazamento (expira rápido)
- Auditabilidade centralizada
- Evita dependência de usuário humano para automações estruturais

### Limitações Importantes
- Não reutilizável fora do contexto do job atual
- Não adequado para acesso a recursos externos que exigem credenciais persistentes
- Pode ter permissões reduzidas por política organizacional (ex: desabilitar gravação em `pull_requests`)
- Não dispara workflows para eventos originados por suas próprias ações (prevenção de recursão)

## Exemplo Prático
Exemplo mínimo de uso explícito com ajuste de permissões:
```yaml
name: Exemplo GITHUB_TOKEN
on: [push]

permissions:
  contents: write
  pull-requests: write

jobs:
  demo:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Criar arquivo e commit
        run: |
          echo "timestamp=$(date -u)" >> build-info.txt
          git config user.name "github-actions"
          git config user.email "github-actions@github.com"
          git add build-info.txt
          git commit -m "chore: adiciona build-info"
          git push
      - name: Chamada à API
        run: |
          curl -H "Authorization: Bearer ${{ github.token }}" \
               -H "Accept: application/vnd.github+json" \
               https://api.github.com/repos/${{ github.repository }}
```

## Conclusão
`GITHUB_TOKEN` oferece autenticação segura, efêmera e integrada ao contexto do repositório, reduzindo necessidade de segredos manuais e diminuindo risco operacional. Dominar seu ciclo de vida, escopo e limitações é passo fundamental antes de introduzir segredos personalizados ou integrações externas mais sensíveis. Se desejar, podemos avançar para: diferenciação entre `GITHUB_TOKEN` e tokens clássicos (PAT), ou aplicação de princípio de menor privilégio em múltiplos jobs. Indique a próxima direção.
