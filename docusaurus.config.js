// @ts-check
import { themes as prismThemes } from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Aprenda DevOps do zero com tutoriais prático',
  tagline: 'Automação, Cloud e DevOps sem enrolação',
  favicon: 'img/favicon.png',

  url: 'https://devopsautomation.com.br',
  baseUrl: '/',
  organizationName: 'iesodias',
  projectName: 'devops-automation-site',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/iesodias/devops-automation-site/tree/main/',
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
        { to: '/#cursos', label: 'Cursos', position: 'left' },
        { to: 'https://youtube.com/@iesodias', label: 'YouTube', position: 'left' },
        { to: '/#instrutor', label: 'Instrutor', position: 'left' },
      ],
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    colorMode: {
      disableSwitch: true,
    },
  },
};

export default config;


// @ts-check
// import { themes as prismThemes } from 'prism-react-renderer';

// /** @type {import('@docusaurus/types').Config} */
// const config = {
//   title: 'Aprenda DevOps do zero com tutoriais prático',
//   tagline: 'Automação, Cloud e DevOps sem enrolação',
//   favicon: 'img/favicon.png',

//   url: 'https://devopsautomation.com.br',
//   baseUrl: '/',
//   organizationName: 'iesodias',
//   projectName: 'devops-automation-site',
//   deploymentBranch: 'gh-pages',
//   trailingSlash: false,
//   onBrokenLinks: 'throw',
//   onBrokenMarkdownLinks: 'warn',

//   i18n: {
//     defaultLocale: 'en',
//     locales: ['en'],
//   },

//   presets: [
//     [
//       'classic',
//       {
//         docs: {
//           sidebarPath: './sidebars.js',
//           editUrl: 'https://github.com/iesodias/devops-automation-site/tree/main/',
//         },
//         blog: {
//           showReadingTime: true,
//           feedOptions: {
//             type: ['rss', 'atom'],
//             xslt: true,
//           },
//           editUrl: 'https://github.com/iesodias/devops-automation-site/tree/main/',
//           onInlineTags: 'warn',
//           onInlineAuthors: 'warn',
//           onUntruncatedBlogPosts: 'warn',
//         },
//         theme: {
//           customCss: './src/css/custom.css',
//         },
//         // ✅ GA4 com gtag
//         gtag: {
//           trackingID: 'G-BRH4789ZE0',
//           anonymizeIP: true,
//         },
//       },
//     ],
//   ],

//   themeConfig: {
//     image: 'img/devops-logo-social.png',
//     navbar: {
//       logo: {
//         alt: 'Logo DevOps Automation',
//         src: 'img/logo-home.png',
//       },
//       items: [
//         { to: '/', label: 'Home', position: 'left' },
//         { to: '/blog', label: 'Blog', position: 'left' },
//         {
//           type: 'docSidebar',
//           sidebarId: 'tutorialSidebar',
//           position: 'left',
//           label: 'Tutoriais',
//         },
//         { to: '/#cursos', label: 'Cursos', position: 'left' },
//         { to: 'https://youtube.com/@iesodias', label: 'YouTube', position: 'left' },
//         { to: '/#instrutor', label: 'Instrutor', position: 'left' },
//       ],
//     },
//     prism: {
//       theme: prismThemes.github,
//       darkTheme: prismThemes.dracula,
//     },
//     colorMode: {
//       disableSwitch: true,
//     },
//   },
// };

// export default config;