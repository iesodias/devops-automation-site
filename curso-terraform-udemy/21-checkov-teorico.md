---
id: checkov-intro
title: Aula 13 - Checkov - Conformidade e LGPD no Terraform
noindex: true
---

# Checkov: Conformidade e LGPD no Terraform

## Introdução

A Lei Geral de Proteção de Dados (LGPD) exige que dados pessoais sejam tratados com segurança, privacidade e controle. Em ambientes de nuvem, onde usamos infraestrutura como código (IaC), garantir que esses princípios sejam respeitados desde o início é essencial.

Ferramentas como o **Checkov** ajudam a implementar **conformidade automatizada** e a detectar configurações inseguras que podem gerar violações legais e operacionais.

## O que é o Checkov

O **Checkov** é uma ferramenta de análise estática (SAST) voltada para infraestrutura como código. Ele avalia se os arquivos de configuração estão de acordo com boas práticas de segurança e **normas de conformidade** como LGPD, ISO 27001, CIS, SOC2, entre outras.

## Por que conformidade é importante

* **Evita multas e sanções**: falhas na proteção de dados podem levar a penalidades legais.
* **Melhora a reputação**: clientes confiam mais em empresas que mostram preocupação com a privacidade.
* **Reduz riscos operacionais**: configurações inseguras podem gerar vazamentos, indisponibilidade ou ataques.

## Como o Checkov ajuda na LGPD

* Identifica configurações perigosas como:

  * Armazenamento público sem controle
  * Falta de criptografia de dados
  * Ausência de logs e monitoramento
  * Recursos acessíveis sem autenticação
* Usa regras baseadas em frameworks reconhecidos
* Pode ser integrado ao processo de desenvolvimento para impedir que código não conforme seja aplicado

## Benefícios do uso do Checkov

* **Automatiza validações de conformidade**
* **Evita erros manuais** de configuração
* **Promove cultura de segurança e privacidade desde o início** (shift left)
* **Ajuda a manter rastreabilidade** e auditoria sobre os requisitos legais

## Melhores práticas em projetos com LGPD

* Adote uma abordagem de segurança por padrão (secure by design)
* Inclua validações automatizadas de conformidade em pipelines
* Treine o time para entender conceitos de privacidade e segurança
* Documente exceções justificadas quando aplicação das regras não for possível
* Monitore continuamente a conformidade com ferramentas como Checkov

## Conclusão

Conformidade com LGPD é uma responsabilidade técnica e estratégica. Usar o Checkov ajuda sua equipe a manter os padrões exigidos pela legislação desde o primeiro commit, promovendo um ciclo de desenvolvimento seguro, controlado e confiável.
