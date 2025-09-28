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
      label: 'Módulo 1 - Introdução IA DevOps Cloud',
      items: [
        'modulo-01-introducao-ia-devops-cloud/prompt-eng',
        'modulo-01-introducao-ia-devops-cloud/importancia-ia-devops',
        'modulo-01-introducao-ia-devops-cloud/o-que-e-llm'
      ],
    },
    {
      type: 'category',
      label: 'Módulo 2 - Como a IA Funciona',
      items: [
        'modulo-02-como-ai-funciona/tokens',
        'modulo-02-como-ai-funciona/chat-models-vs-reasoning',
        'modulo-02-como-ai-funciona/janela-de-contexto',
        'modulo-02-como-ai-funciona/alucinacoes-ia'
      ],
    },
    {
      type: 'category',
      label: 'Módulo 3 - Princípios de Prompt Engineering',
      items: [
        'modulo-03-principios-prompt-engineering/give-direction',
        'modulo-03-principios-prompt-engineering/specify-format',
        'modulo-03-principios-prompt-engineering/provide-examples',
        'modulo-03-principios-prompt-engineering/evaluate-quality',
        'modulo-03-principios-prompt-engineering/divide-labor'
      ],
    },
    {
      type: 'category',
      label: 'Módulo 4 - Engenharia de Prompt Engineering',
      items: [
        'modulo-04-engenharia-prompt/personas-aja-como',
        'modulo-04-engenharia-prompt/cadeia-pensamento-explique-raciocinio'
      ],
    },    {
      type: 'category',
      label: 'Módulo 5 - ChatGPT DevOps Cloud',
      items: [
        'modulo-05-chatgpt-devops-cloud/introducao-chatgpt-devops',
        'modulo-05-chatgpt-devops-cloud/chatgpt-free-vs-paid',
        'modulo-05-chatgpt-devops-cloud/chatgpt-deep-research',
        'modulo-05-chatgpt-devops-cloud/chatgpt-canvas',
        'modulo-05-chatgpt-devops-cloud/gpt-store-building-custom-gpts',
        'modulo-05-chatgpt-devops-cloud/prompts-basicos-devops',
        'modulo-05-chatgpt-devops-cloud/analise-logs-chatgpt'
      ],
    },
    {
      type: 'category',
      label: 'Módulo 6 - Google Gemini DevOps',
      items: [
        'modulo-06-google-gemini-devops/introducao-google-gemini-2025',
        'modulo-06-google-gemini-devops/gemini-free-vs-paid-escolha-estrategica',
        'modulo-06-google-gemini-devops/gemini-cli-automacao-terminal',
        'modulo-06-google-gemini-devops/gemini-agent-mode-vscode',
        'modulo-06-google-gemini-devops/instalando-gemini-cli',
        'modulo-06-google-gemini-devops/prompts-gemini'
      ],
    },
    {
      type: 'category',
      label: 'Módulo 7 - Claude AI DevOps',
      items: [
        'modulo-07-claude-ai-devops/introducao-claude-ai-2025',
        'modulo-07-claude-ai-devops/claude-free-vs-paid-escolha-estrategica',
        'modulo-07-claude-ai-devops/claude-code-cli-automacao-terminal'
      ],
    },
  ],
};