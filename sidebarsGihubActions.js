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
      items: ['modulo-02-Introducao-Github-Actions/github-actions','modulo-02-Introducao-Github-Actions/componentes','modulo-02-Introducao-Github-Actions/arquitetura','modulo-02-Introducao-Github-Actions/interface','modulo-02-Introducao-Github-Actions/actions','modulo-02-Introducao-Github-Actions/marketplace'],
    },
    {
      type: 'category',
      label: 'Módulo 3 - Criando Workflows',
      items: ['modulo-03-Criando-workflow/estrutura','modulo-03-Criando-workflow/yaml','modulo-03-Criando-workflow/triggers','modulo-03-Criando-workflow/workflow-basico','modulo-03-Criando-workflow/jobs'],
    },
    {
      type: 'category',
      label: 'Módulo 4 - Avançado',
      items: [
        'modulo-04-avancado/github-token',
        'modulo-04-avancado/secrets',
        'modulo-04-avancado/contex-exp',
        'modulo-04-avancado/env-proc',
        'modulo-04-avancado/matrix-conc',
        'modulo-04-avancado/artefatos',
        'modulo-04-avancado/logs-debug',
        'modulo-04-avancado/dev-actions',
        'modulo-04-avancado/custo-performance'
      ],
    },
  ],
};