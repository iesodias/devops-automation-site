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
      items: ['lab-1-rg', 'lab-2-variables-output', 'lab-3-for-each-count', 'lab-4-fmt-validate', 'lab-5-tfstate-remoto', 'lab-6-data'],
    },
    {
      type: 'category',
      label: 'Modulo 2 - Análise Estática (SAST) para IaC',
      items: ['trivy-teorico', 'trivy-teorico-1','checkov-intro','checkov-comandos','checkov-github'],
    },
    {
      type: 'category',
      label: 'Labs 2 - Análise Estática (SAST) para IaC',
      items: ['trivy-teorico', 'trivy-teorico-1'],
    },
  ],
};
