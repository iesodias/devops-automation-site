---
id: 14-rego
title: Lab 14 - Introdução à Linguagem Rego
noindex: true
---

# Introdução à Linguagem Rego

## Introdução

A linguagem **Rego** é o coração do Open Policy Agent (OPA), projetada para trabalhar com documentos estruturados como JSON. Inspirada em **Datalog**, Rego foi desenvolvida para definir políticas de forma clara, concisa e segura. Ao usar Rego, você pode inspecionar e transformar dados estruturados para garantir que suas configurações estejam em conformidade com regras organizacionais.

Rego é uma linguagem **declarativa**, ou seja, você define o que espera como resultado, e não como chegar até ele. Isso facilita a leitura e manutenção das políticas, reduzindo erros e ambiguidades.

## O que é a linguagem Rego

Rego é usada para criar **consultas sobre dados armazenados no OPA**, permitindo definir políticas que enumeram condições esperadas ou proibidas. É especialmente útil para raciocinar sobre planos de execução do Terraform, definições do Kubernetes, configurações de API gateways e outros documentos estruturados.

## Explicação técnica

* Rego é baseada em expressões lógicas
* Trabalha com dados aninhados e estruturas JSON complexas
* Define regras como afirmações lógicas com condições que retornam valores, mensagens ou flags
* Pode retornar listas, booleanos, mensagens explicativas, etc.
* Suporta operações lógicas, condicionais, laços, conjuntos e arrays

## Benefícios da Rego

* **Fácil de escrever e ler**: regras claras, curtas e diretas
* **Declarativa**: foca no "o quê", não no "como"
* **Auditável**: políticas como código, versionadas e revisáveis
* **Otimizada**: o OPA pode melhorar a performance das consultas
* **Reutilizável**: regras podem ser usadas em diferentes sistemas

## Onde aplicar Rego

* **Localmente**: para testar e validar regras antes de comitar
* **No CI/CD**: para validar pull requests e planos de execução
* **Em sistemas de autenticação e API gateways**: para tomar decisões de acesso

## Quando usar Rego na máquina local

* Durante o desenvolvimento de regras
* Para validação de configurações antes do push
* Para testes manuais de regras específicas com o playground online

## Quando usar Rego na pipeline

* Validar `plan.json` do Terraform antes do apply
* Bloquear merges com configurações não conformes
* Rodar validações em ambientes de staging e produção

## Exemplo (teórico)

```rego
package segurança

deny[msg] {
  input.resource_changes[_].change.after.associate_public_ip_address == true
  msg = "IP público não permitido."
}
```

Essa regra percorre os recursos do plano do Terraform e retorna uma mensagem caso encontre instâncias com IP público habilitado.

## Output esperado

```bash
+----------------------------------------+
| data.seguranca.deny                   |
+----------------------------------------+
| [{"msg": "IP público não permitido."}] |
+----------------------------------------+
```

## Melhores práticas

* Escreva regras simples e com uma responsabilidade clara
* Use nomes descritivos para pacotes e variáveis
* Comente regras complexas para facilitar entendimento
* Agrupe regras por contexto (ex: rede, segurança, custo)
* Escreva testes para suas regras com `opa test`
* Use o [OPA Playground](https://play.openpolicyagent.org) para testar e compartilhar exemplos

## Conclusão

A linguagem Rego é um pilar fundamental na implementação de **Policy as Code**. Aprender seus conceitos permite automatizar validações e garantir conformidade desde o desenvolvimento, promovendo segurança, governança e eficiência em projetos com Terraform e outras tecnologias.
