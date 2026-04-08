import React from 'react';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';
import CoursesSection from '../components/CoursesSection';
import styles from './index.module.css';

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DevOps Automation',
    url: 'https://devopsautomation.com.br',
    logo: 'https://devopsautomation.com.br/img/devops-logo.png',
    sameAs: [
      'https://www.youtube.com/channel/UCxRNzCKgqQ0FW0GKuRSjlEQ',
      'https://linkedin.com/in/iesodias',
      'https://instagram.com/iesofdias',
      'https://github.com/iesodias',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DevOps Automation',
    url: 'https://devopsautomation.com.br',
    description:
      'Aprenda DevOps do zero com tutoriais práticos, automação, cloud e CI/CD',
    inLanguage: 'pt-BR',
  },
];

export default function Home() {
  return (
    <Layout
      title="Devops para Iniciantes"
      description="Aprenda DevOps com laboratórios práticos!"
    >
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </Head>
      <main className={styles.main}>
        {/* HERO COM BACKGROUND E LOGO IMPACTANTE */}
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.logoWrap}>
              <img
                src="/img/devops-logo.png"
                alt="DevOps Automation - Plataforma de tutoriais e cursos DevOps"
                className={styles.logo}
              />
            </div>

            <p className={styles.heroSubtitle}>
              Aprenda as habilidades mais procuradas em DevOps e Cloud com cursos objetivos, práticos e voltados para o mercado
            </p>

            <div className={styles.heroCtas}>
              <a
                id="cursos"
                href="/#cursos"
                className={styles.ctaPrimary}
              >
                🚀 Comece Agora
              </a>

              <a
                href="https://youtube.com/@iesodias"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaSecondary}
              >
                ou conheça o canal →
              </a>
            </div>
          </div>
        </div>

        {/* Seção de cursos */}
        <CoursesSection />

        {/* BLOCO YOUTUBE COM IMAGEM NOVA */}
        <div className={styles.youtube}>
          <div className={styles.youtubeInner}>
            <img
              src="/img/devops_banner_youtube.png"
              alt="Canal YouTube DevOps Automation - Tutoriais práticos de DevOps, Cloud e Automação"
              className={styles.youtubeBanner}
            />

            <h2 className={styles.youtubeHeading}>
              Quer aprender mais sobre DevOps na prática?
            </h2>

            <p className={styles.youtubeText}>
              No canal do YouTube eu publico vídeos semanais com dicas, labs e tutoriais práticos. Já somos milhares aprendendo juntos!
            </p>

            <a
              href="https://youtube.com/@iesodias"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.youtubeBtn}
            >
              👉 Conheça o Canal no YouTube
            </a>
          </div>
        </div>

        {/* BLOCO SOBRE O INSTRUTOR */}
        <div id="instrutor" className={styles.instructor}>
          <h2 className={styles.instructorHeading}>
            Conheça o Instrutor
          </h2>

          <p className={styles.instructorText}>
            Iêso Dias é especialista em DevOps com anos de experiência em automação, pipelines, cloud computing e ensino técnico prático.
          </p>

          <div className={styles.instructorImgWrap}>
            <img
              src="/img/career-cta.png"
              alt="Iêso Dias - Instrutor DevOps e especialista em automação cloud"
              className={styles.instructorImg}
            />
          </div>
        </div>
      </main>
    </Layout>
  );
}
