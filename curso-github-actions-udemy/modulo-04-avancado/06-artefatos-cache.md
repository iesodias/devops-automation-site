---
id: artefatos
title: "Artefatos e Cache"
---

# Artefatos e Cache: Boas Práticas

## Introdução

Artefatos servem para compartilhar arquivos entre jobs e preservar resultados (por exemplo, relatórios). Cache armazena dependências para acelerar execuções futuras. Usar ambos corretamente reduz tempo de pipeline e evita transferências e downloads repetidos.

## Definição

Artefatos são pacotes de arquivos enviados ao storage do GitHub Actions e recuperados em outros jobs ou execuções. Cache guarda arquivos no storage de cache do Actions com chaves (`key`) que determinam quando reutilizar o que já foi salvo. Chaves estáveis e previsíveis são essenciais para bons acertos de cache.

Links oficiais:
- Upload/Download Artifact: https://docs.github.com/pt/actions/using-workflows/storing-workflow-data-as-artifacts
- Cache: https://docs.github.com/pt/actions/using-workflows/caching-dependencies-to-speed-up-workflows

## Explicação Técnica

Para artefatos, utilize as actions oficiais `actions/upload-artifact` e `actions/download-artifact`. Defina nomes que indiquem conteúdo e, se necessário, expire os artefatos automaticamente conforme política do repositório. Artefatos têm limites de tamanho por arquivo e por repositório — evite enviar diretórios inteiros sem necessidade.

Para cache, `actions/cache` usa uma `key` e, opcionalmente, `restore-keys` para fallback. `hashFiles()` ajuda a invalidar cache quando arquivos de lock mudam. Seja criterioso no `path` para evitar caches grandes e não determinísticos. Lembre-se de que o cache não é um artefato: ele não serve para compartilhar resultados entre jobs na mesma execução.

Boas práticas: use `hashFiles('**/package-lock.json')` (ou equivalente) para chaves reprodutíveis, mantenha caches por ecossistema (Node, Python) e evite armazenar diretórios com artefatos gerados que variam a cada execução.

## Exemplo

Exemplo simples com cache de dependências e upload de um relatório como artefato.

```yaml
name: Aula 23 — Artefatos e Cache
on: { workflow_dispatch: }

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Preparar chave de cache
        run: |
          echo "Usando hash de arquivos de lock para cache"
      - name: Cache de dependências Node
        uses: actions/cache@v4
        with:
          path: ~/.npm
          key: npm-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            npm-${{ runner.os }}-
      - name: Instalar deps e gerar relatório
        run: |
          echo "Instalando dependências e gerando relatório..."
          echo "Relatório gerado" > report.txt
      - name: Upload do relatório
        uses: actions/upload-artifact@v4
        with:
          name: build-report
          path: report.txt
```

O job usa uma chave de cache baseada no SO e no hash dos lockfiles para acelerar instalações em runs futuros e, ao final, sobe um arquivo `report.txt` como artefato para consulta ou consumo posterior.

## Conclusão

Artefatos e cache resolvem problemas diferentes: compartilhamento de arquivos versus aceleração de dependências. Ao nomear bem, escolher caminhos e chaves reprodutíveis e respeitar limites, você reduz o tempo total dos workflows sem acumular dados desnecessários.
