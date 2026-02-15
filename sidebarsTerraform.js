/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
module.exports = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Introdução',
      items: ['index', 'introducao'],
    },
    {
      type: 'category',
      label: 'Modulo 0 - Conceitos Iniciais',
      items: ['iac', 'beneficios'],
    },
    {
      type: 'category',
      label: 'Modulo 1 - Introdução ao Terraform',
      items: ['hcl-intro', 'ciclo-terraform', 'variaveis-outputs', 'tipos-variaveis', 'foreach-count', 'fmt-validate-show', 'backend-remote', 'data-block', 'tfvars', 'workspaces', 'locals'],
    },
    {
      type: 'category',
      label: 'Labs 1 - Introdução ao Terraform',
      items: ['lab-1-rg', 'lab-2-variables-output', 'lab-3-for-each-count', 'lab-4-fmt-validate', 'lab-5-tfstate-remoto', 'lab-6-data', 'lab-7-tfvars', 'lab-8-ws' ,'lab-9-locals'],
    },
    {
      type: 'category',
      label: 'Modulo 2 - Análise Estática (SAST) para IaC',
      items: ['trivy-teorico', 'trivy-teorico-1','checkov-intro','checkov-comandos','checkov-github'],
    },
    {
      type: 'category',
      label: 'Labs 2 - Análise Estática (SAST) para IaC',
      items: ['lab-10-trivy', 'lab-11-checkov'],
    },
    {
      type: 'category',
      label: 'Modulo 3 - Policy as Code (PaC)',
      items: ['12-opa-teoria', '13-opa-confest','14-rego'],
    },
    {
      type: 'category',
      label: 'Labs 3 - Policy as Code (PaC)',
      items: ['lab-15-confest-opa', 'lab-16-confest-opa'],
    },
    {
      type: 'category',
      label: 'Modulo 4 - Módulos no Terraform',
      items: ['17-modulos-teoria'],
    },
    {
      type: 'category',
      label: 'Labs 4 - Módulos',
      items: ['lab-18-modulos'],
    },
    {
      type: 'category',
      label: 'Modulo 5 - Protegendo Dados Sensiveis com Vault',
      items: ['19-dados-sensiveis', '20-intro-kevault', '21-criar-vm-kevault','22-lab-kevault'],
    },
    {
      type: 'category',
      label: 'Modulo 6 - Terraform Cloud',
      items: ['23-terraform-cloud','24-sentinel'],
    },
    {
      type: 'category',
      label: 'Lab 6 - Terraform Cloud',
      items: ['25-lab-sentinel-tfc'],
    },
    {
      type: 'category',
      label: 'Modulo 7 - IA para IaC',
      items: ['01-terraform-ia-importancia', '01-terraform-copilot'],
    },
    {
      type: 'category',
      label: 'Projeto Final',
      items: ['98-projeto-final','99-projeto-final'],
    },
    {
      type: 'category',
      label: 'Certificação HashiCorp',
      items: ['bonus-certificacao'],
    },
  ],
};



