import React from 'react';
import Layout from '@theme/Layout';
import CoursesSection from '../components/CoursesSection';
import styles from './index.module.css';

export default function Home() {
  return (
    <Layout
      title="Devops para Iniciantes"
      description="Aprenda DevOps com laboratórios práticos!"
    >
      <main className={styles.main}>
        {/* HERO COM BACKGROUND E LOGO IMPACTANTE */}
        <div className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.logoWrap}>
              <img
                src="/img/devops-logo.png"
                alt="DevOps Automation Logo"
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
              alt="Banner YouTube DevOps"
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
              alt="Iêso Dias"
              className={styles.instructorImg}
            />
          </div>
        </div>
      </main>
    </Layout>
  );
}
