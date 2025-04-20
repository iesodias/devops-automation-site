import React from 'react';
import Layout from '@theme/Layout';
import CoursesSection from '../components/CoursesSection';

export default function Home() {
  return (
    <Layout
      title="Curso DevOps com Iêso Dias"
      description="Aprenda DevOps com laboratórios práticos no YouTube"
    >
      <main style={{ backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }}>
        {/* HERO COM BACKGROUND E TÍTULO IMPACTANTE */}
        <div
          style={{
            backgroundImage: "url('/img/hero-bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            padding: '6rem 2rem 5rem',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <div style={{ maxWidth: '900px', margin: '0 auto', color: '#1c1e21' }}>
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '3rem', fontWeight: 'bold', lineHeight: '1.2', margin: 0 }}>
                Devops Automation
              </h1>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 'bold', color: '#7e1c84', margin: 0 }}>
                AUTOMAÇÃO & DEVOPS & CLOUD
              </h2>
            </div>

            {/* <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>
              com Iêso Dias
            </h2> */}

            <p style={{ fontSize: '1.2rem', color: '#333', marginBottom: '3rem' }}>
              Aprenda as habilidades mais procuradas em DevOps e Cloud com cursos objetivos, práticos e voltados para o mercado
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <a
                id="cursos"
                href="/#cursos"
                style={{
                  backgroundColor: '#1c2385',
                  color: 'white',
                  padding: '1rem 2.5rem',
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                }}
              >
                🚀 Comece Agora
              </a>

              <a
                href="https://youtube.com/@iesodias"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#1c2385',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  textDecoration: 'underline',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                ou conheça o canal →
              </a>
            </div>
          </div>
        </div>

        {/* Seção de cursos */}
        <CoursesSection />

        {/* BLOCO YOUTUBE COM IMAGEM NOVA */}
        <div
          style={{
            padding: '3rem 2rem',
            textAlign: 'center',
            backgroundColor: '#f9f9f9',
          }}
        >
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <img
              src="/img/devops_banner_youtube.png"
              alt="Banner YouTube DevOps"
              style={{
                width: '100%',
                maxWidth: '727px',
                height: 'auto',
                marginBottom: '2rem',
                borderRadius: '16px',
              }}
            />

            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1c1e21', marginBottom: '1rem' }}>
              Quer aprender mais sobre DevOps na prática?
            </h2>

            <p style={{ fontSize: '1rem', color: '#444', marginBottom: '2rem' }}>
              No canal do YouTube eu publico vídeos semanais com dicas, labs e tutoriais práticos. Já somos milhares aprendendo juntos!
            </p>

            <a
              href="https://youtube.com/@iesodias"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: '#f39132',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 'bold',
                textDecoration: 'none',
              }}
            >
              👉 Conheça o Canal no YouTube
            </a>
          </div>
        </div>

        {/* BLOCO SOBRE O INSTRUTOR */}
        <div
          id="instrutor"
          style={{
            backgroundColor: '#ffffff',
            padding: '4rem 2rem',
            margin: '0 auto',
            maxWidth: '800px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1c1e21', marginBottom: '1rem' }}>
            Conheça o Instrutor
          </h2>

          <p style={{ fontSize: '1rem', color: '#333', marginBottom: '2rem' }}>
            Iêso Dias é especialista em DevOps com anos de experiência em automação, pipelines, cloud computing e ensino técnico prático.
          </p>

          <div>
            <img
              src="/img/career-cta.png"
              alt="Iêso Dias"
              style={{
                maxWidth: '727px',
                width: '100%',
                height: 'auto',
                borderRadius: '16px',
              }}
            />
          </div>
        </div>
      </main>
    </Layout>
  );
}
