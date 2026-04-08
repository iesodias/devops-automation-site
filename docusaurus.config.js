// @ts-check
import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Aprenda DevOps do zero com tutoriais práticos',
  tagline: 'Automação, Cloud e DevOps sem enrolação',
  favicon: 'img/favicon.png',

  url: 'https://devopsautomation.com.br',
  baseUrl: '/',
  organizationName: 'iesodias',
  projectName: 'devops-automation-site',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/iesodias/devops-automation-site/tree/main/',
          showLastUpdateTime: true,
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/iesodias/devops-automation-site/tree/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          trackingID: 'G-BRH4789ZE0',
          anonymizeIP: true,
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.7,
          ignorePatterns: ['/udemy/**'],
          filename: 'sitemap.xml',
        },
      },
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'terraform-automacao',
        path: 'curso-terraform-udemy',
        routeBasePath: 'udemy/terraform-automacao',
        sidebarPath: require.resolve('./sidebarsTerraform.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'ai-devops-automacao',
        path: 'curso-ai-devops-udemy',
        routeBasePath: 'udemy/ai-devops-automacao',
        sidebarPath: require.resolve('./sidebarsAiDevops.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'github-actions-automacao',
        path: 'curso-github-actions-udemy',
        routeBasePath: 'udemy/github-actions-automacao',
        sidebarPath: require.resolve('./sidebarsGihubActions.js'),
      },
    ],
  ],

  headTags: [
    {
      tagName: 'script',
      attributes: {},
      innerHTML: `
        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
      `,
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:locale',
        content: 'pt_BR',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'google-site-verification',
        content: 'evRUbnxPoFHgxO3EFiS9bU-4tg2FxXrRWq-QSAJZVPM',
      },
    },
  ],

  themeConfig: {
    image: 'img/devops-logo-social.png',
    navbar: {
      logo: {
        alt: 'Logo DevOps Automation',
        src: 'img/logo-home.png',
      },
      items: [
        { to: '/', label: 'Home', position: 'left' },
        { to: '/blog', label: 'Blog', position: 'left' },
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Tutoriais',
        },
        { href: '/#cursos', label: 'Cursos', position: 'left' },
        { href: 'https://youtube.com/@iesodias', label: 'YouTube', position: 'left' },
        { href: '/#instrutor', label: 'Instrutor', position: 'left' },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    colorMode: {
      disableSwitch: false,
      defaultMode: 'light',
    },
  },
};

export default config;
