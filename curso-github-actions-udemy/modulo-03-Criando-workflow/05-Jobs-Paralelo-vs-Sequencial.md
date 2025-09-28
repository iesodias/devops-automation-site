---
id: jobs
title: "Jobs: Paralelo vs Sequencial"
---

# Jobs: Paralelo vs Sequencial

## Introdução
Entender como jobs são executados (paralelo por padrão ou sequencial mediante dependências) é essencial para otimizar tempo de execução, garantir ordem lógica de validações e reduzir custo. Esta aula apresenta o comportamento padrão, como controlar a ordem com `needs`, padrões de encadeamento e considerações de desempenho e confiabilidade.

## Definição
- Job: unidade de execução isolada dentro de um workflow, roda em seu próprio runner (máquina efêmera) com ambiente independente.
- Paralelo (padrão): múltiplos jobs definidos no mesmo nível em `jobs:` começam assim que seus requisitos implícitos (nenhum, se não há `needs`) são atendidos.
- Sequencial: ordenação explícita criada adicionando `needs: <job_anterior>` (ou lista) indicando dependência; um job só inicia quando todos os jobs referenciados concluíram com sucesso.

## Explicação Técnica
Por padrão cada job declarado sem `needs` inicia independentemente após o parsing do workflow. Isso utiliza runners separados, permitindo paralelização horizontal (reduz tempo total quando não há acoplamento). Quando existe relação lógica (ex: testes antes de build de artefato ou build antes de deploy), usa-se `needs` para impor sequência.

`needs` aceita:
- Um único identificador: `needs: testes`
- Lista: `needs: [lint, testes]`

Falha em algum job requerido impede execução dos dependentes (estado “skipped”). Isso implementa curto-circuito de qualidade.

Encadeamentos comuns:
- Fan-out: um job inicial gera base (ex: preparar dependências) e vários jobs paralelos o consomem.
- Fan-in: múltiplos jobs paralelos produzem resultados que convergem em um agregador final (ex: job de merge de cobertura ou empacotamento único).

Boas práticas ao modelar:
- Evitar sequência artificial quando não há real dependência (reduz desperdício de tempo).
- Agrupar responsabilidades coesas dentro de um job para diminuir overhead de inicialização, mas não inflar demais (logs difíceis de ler, impossibilidade de paralelizar depois).
- Empregar nomes curtos e descritivos (`lint`, `testes`, `build`, `publicar`).

Compartilhamento de artefatos exige dependência lógica: um job só acessa artefato enviado por outro após upload concluído. Encadeamento com `needs` garante ordem.

`matrix` amplia paralelização dentro de um único job (várias variações de ambiente), enquanto múltiplos jobs ampliam paralelização estrutural entre fases. Ambos podem coexistir (ex: job `testes` com `strategy.matrix` seguido por job `agregar` que faz fan-in dos resultados).

Considerações de performance:
- Paralelizar reduz tempo crítico de feedback (CI), mas aumenta consumo de minutos (caso de runners hospedados). Equilibrar tempo x custo.
- Jobs muito curtos (segundos) podem sofrer mais overhead de provisionamento que ganho real — avaliar junção.
- Sequência forçada em cadeia longa (`A -> B -> C -> D`) pode virar gargalo; avaliar fan-out/fan-in.

Confiabilidade:
- Dependência profunda amplia impacto de uma falha inicial.
- Uso exagerado de fan-in pode criar job final crítico gigante (risco único). Dividir agregações quando possível.

Limites / atenção:
- Número máximo de jobs simultâneos varia por plano (consultar quotas atuais).
- Dependências circulares não são permitidas (erro de validação).

## Exemplo Prático
Fluxo com paralelização inicial e convergência final:
```yaml
name: Jobs Paralelo vs Sequencial
on: [push]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Lint
        run: echo "Lint OK"

  testes:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Testes
        run: echo "Testes OK"

  build:
    needs: [lint, testes]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Build
        run: echo "Build executado"

  publicar:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Publicar (simulado)
        run: echo "Publicação concluída"
```
Comportamento:
- `lint` e `testes` iniciam em paralelo.
- `build` aguarda ambos concluírem.
- `publicar` só executa se `build` tiver sucesso.

## Conclusão
Jobs executam em paralelo por padrão, e a introdução de `needs` fornece mecanismo declarativo para impor ordem e controlar dependências explícitas. O desenho correto equilibra feedback rápido (paralelização) e integridade lógica (sequência). Esta base permite avançar para tópicos como fan-out com matriz, agregação de artefatos e otimização de tempo total de pipeline. Se desejar aprofundar em modelagem de fan-in/fan-out avançado ou matriz combinatória, indique para calibrarmos a próxima aula.
