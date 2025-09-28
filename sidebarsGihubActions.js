/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
module.exports = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Introdução',
      items: ['index'],
    },
    {
      type: 'category',
      label: 'Módulo 1 - Fundamentos DevOps & Pipeline',
      items: ['modulo-01-fundamentos/devops-intro','modulo-01-fundamentos/ci','modulo-01-fundamentos/cd','modulo-01-fundamentos/git-github'],
    },
    {
      type: 'category',
      label: 'Módulo 2 - Introdução ao GitHub Actions',
      items: ['modulo-02-Introducao-Github-Actions/github-actions','modulo-02-Introducao-Github-Actions/componentes','modulo-02-Introducao-Github-Actions/arquitetura','modulo-02-Introducao-Github-Actions/interface','modulo-02-Introducao-Github-Actions/O-que-sao-Actions','modulo-02-Introducao-Github-Actions/marketplace'],
    },
    {
      type: 'category',
      label: 'Módulo 3 - Criando Workflows',
      items: ['modulo-03-Criando-workflow/estrutura','modulo-03-Criando-workflow/yaml','modulo-03-Criando-workflow/triggers','modulo-03-Criando-workflow/workflow-basico','modulo-03-Criando-workflow/jobs'],
    },
    {
      type: 'category',
      label: 'Módulo 4 - Segurança & Segredos',
      items: ['modulo-04-security/github-token','modulo-04-security/secrets'],
    },
  ],
};