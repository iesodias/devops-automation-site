---
id: 98-projeto-final
title: Aula Final - Projeto Final Terraform
noindex: true
---

# Lab: Criando Infraestrutura Completa de VMs no Azure com Terraform

## Introdução

Neste lab avançado, vamos construir uma infraestrutura empresarial completa no Microsoft Azure utilizando Terraform. Este projeto representa o culminar de todos os conceitos aprendidos durante o curso, demonstrando como criar uma solução de produção real com todas as camadas necessárias: computação, rede, segurança, storage, monitoramento e backup.

O lab simula um cenário empresarial onde precisamos provisionar ambientes para uma aplicação web, com configurações diferentes para desenvolvimento e produção, aplicando boas práticas de Infrastructure as Code (IaC) e gestão de custos.

## O que você vai aprender

* Como estruturar um projeto Terraform complexo e escalável
* Utilização avançada de variables, locals e outputs para código reutilizável
* Implementação de múltiplos providers (azurerm, random, tls, time)
* Criação de recursos condicionais baseados no ambiente
* Aplicação de naming conventions e tags organizacionais
* Gestão inteligente de custos com auto-shutdown e sizing por ambiente
* Implementação de segurança com Key Vault e SSH keys automatizadas
* Configuração de backup e monitoramento condicionais

## Pré-requisitos

* Terraform instalado (versão >= 1.5.0)
* Conta Azure com permissões de Contributor
* Azure CLI instalada e autenticada
* Conhecimento dos conceitos básicos de Terraform
* Familiaridade com Azure (VMs, networking, storage)

## Arquitetura da Solução

Nossa infraestrutura será composta por múltiplas camadas integradas:

### Camada de Rede
- Virtual Network com segmentação em subnets
- Network Security Groups com regras de firewall específicas
- Public IPs para acesso externo controlado
- Application Security Groups para micro-segmentação
- Private DNS Zone para resolução interna

### Camada de Computação
- Virtual Machines Linux com Ubuntu 20.04 LTS
- Configuração flexível de quantidade e tamanho por ambiente
- Auto-shutdown programado para economia de custos
- SSH keys geradas e gerenciadas automaticamente

### Camada de Storage
- Managed Disks com diferentes tiers por ambiente
- Storage Account para boot diagnostics
- Backup automático configurável

### Camada de Segurança
- Azure Key Vault para gerenciamento de secrets
- Network Security Groups com regras restritivas
- SSH keys criptografadas e rotacionáveis
- Tags para governança e compliance

### Camada de Monitoramento (Opcional)
- Log Analytics Workspace para centralização de logs
- Azure Monitor com alertas proativos
- VM Extensions para coleta de métricas

## Estrutura do Projeto

O projeto seguirá uma estrutura organizacional profissional:

```
azure-terraform-vm-project/
├── main.tf                    # Recursos principais da infraestrutura
├── variables.tf               # Definições de variáveis com validação
├── locals.tf                  # Lógica complexa e naming conventions
├── outputs.tf                 # Informações de saída estruturadas
├── versions.tf                # Configuração de providers e versões
├── additional-resources.tf    # Recursos avançados e opcionais
├── terraform.tfvars           # Valores padrão das variáveis
├── dev.tfvars                # Configuração para desenvolvimento
├── prod.tfvars               # Configuração para produção
├── README.md                 # Documentação do projeto
└── .gitignore               # Arquivos a serem ignorados pelo Git
```

## Conceitos Terraform Demonstrados

### Fundamentos Avançados
- Variables com tipos complexos (objects, lists) e validações customizadas
- Locals com lógica condicional e cálculos dinâmicos
- Outputs estruturados retornando informações úteis
- Count e for_each para criação de múltiplos recursos
- Dynamic blocks para configurações condicionais

### Providers e Integração
- Múltiplos providers trabalhando em conjunto
- Data sources para consultar informações existentes
- Resource dependencies implícitas e explícitas
- Lifecycle rules para proteção de recursos críticos

### Organização e Boas Práticas
- Separação de ambientes com arquivos .tfvars específicos
- Naming conventions automatizadas e consistentes
- Tagging strategy para organização e billing
- Estrutura de código modular e reutilizável

## Ambientes e Configurações

### Ambiente de Desenvolvimento
- VMs menores e econômicas (Standard_B1s)
- Discos Standard para redução de custos
- Auto-shutdown às 18h para economia
- Backup desabilitado (dados não críticos)
- Monitoramento básico

### Ambiente de Produção
- VMs robustas com alta disponibilidade (Standard_D2s_v3)
- Múltiplas instâncias com Load Balancer
- Discos Premium para performance
- Backup habilitado com retenção de 90 dias
- Monitoramento completo com alertas
- Sem auto-shutdown (disponibilidade 24/7)

## Gestão de Custos

O projeto implementa várias estratégias de otimização de custos:

- **Auto-shutdown**: VMs se desligam automaticamente fora do horário comercial
- **Sizing inteligente**: Recursos dimensionados apropriadamente por ambiente
- **Storage optimization**: Tipos de disco adequados ao uso (Standard vs Premium)
- **Recursos condicionais**: Backup e monitoring apenas quando necessário
- **Tags para billing**: Facilita análise de custos por projeto/departamento

## Funcionalidades Avançadas

- **Geração automática de SSH keys**: Terraform cria e gerencia as chaves
- **Key Vault integration**: Secrets armazenados de forma segura
- **Conditional resources**: Recursos criados baseados em variáveis
- **Multi-environment**: Mesmo código, configurações diferentes
- **Naming automation**: Nomes padronizados e únicos automaticamente
- **Tag inheritance**: Tags aplicadas consistentemente em todos os recursos

## Estimativa de Investimento

### Ambiente de Desenvolvimento
- Custo mensal: ~$8-15 USD (com auto-shutdown)
- Ideal para testes e aprendizado

### Ambiente de Produção
- Custo mensal: ~$390-515 USD (3 VMs com todos os recursos)
- Solução empresarial completa

## Valor Profissional

Este lab demonstra competências essenciais para:
- **Cloud Engineers**: Arquitetura e implementação Azure
- **DevOps Engineers**: Infrastructure as Code avançado
- **SRE**: Automação, monitoramento e gestão de custos
- **Arquitetos de Soluções**: Design de infraestrutura escalável

O projeto representa exatamente o tipo de solução que empresas implementam em produção, mostrando domínio profissional de Terraform e boas práticas de cloud computing.

## Próximos Passos

Após completar este lab, você estará preparado para:
- Implementar soluções Terraform em ambiente corporativo
- Gerenciar infraestrutura multi-ambiente de forma eficiente
- Aplicar boas práticas de segurança e governança em cloud
- Otimizar custos mantendo performance e disponibilidade
- Evoluir a solução para arquiteturas mais complexas (microservices, containers, etc.)

Este é o projeto que demonstrará sua competência técnica em entrevistas e projetos reais!