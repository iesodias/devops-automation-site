import React from 'react';
import styles from './CoursesSection.module.css';

const courses = [
  {
    image: '/img/devops_automacao.png',
    title: 'Devops: Automação Sem Enrolação',
    description: 'Domine DevOps com automações reais, laboratórios práticos e sem enrolação. Aprenda na prática o que o mercado exige.',
    stars: 5,
    badge: 'BESTSELLER', //// Adicionado o selo para funcionar
    tags: ['K8S', 'Terraform', 'Docker', 'Github Actions', 'Datadog'],
    link: 'https://www.udemy.com/course/devops-automacao-sem-enrolacao/?couponCode=CA1E128B67B670F1B078', // Link adicionado
  },
  {
    image: '/img/ia.png',
    title: 'Engenharia de Prompt: Domine ChatGPT, Gemini e Claude',
    description: 'Aprenda técnicas avançadas de prompt engineering com as principais IAs do mercado. Domine ChatGPT, Gemini e Claude para automações inteligentes.',
    stars: 5,
    badge: 'NOVO',
    tags: ['ChatGPT', 'Gemini', 'Claude', 'Prompt Engineering', 'AI'],
    link: 'https://www.udemy.com/course/engenharia-de-prompt-para-desenvolvedores-e-devops/?referralCode=8D82110C386AC1683361',
  },
  {
    image: '/img/terraform.png',
    title: 'Terraform: IaC no Azure Sem Enrolação',
    description: 'Domine infraestrutura como código no Azure com Terraform na prática. Automatize recursos cloud de forma profissional e escalável.',
    stars: 5,
    badge: 'NOVO',
    tags: ['Terraform', 'Azure', 'IaC', 'Cloud', 'Automation'],
    link: 'https://www.udemy.com/course/terraform-seguro-2025-devsecops-azure-sem-vulnerabilidades/?referralCode=56AC1D8EE6FC6574CEDE',
  },
  {
    image: '/img/chat.png',
    title: 'IA com ChatGPT Sem Enrolação — Do Zero ao Essencial',
    description: 'Do básico ao avançado: aprenda a usar ChatGPT de forma estratégica para automação, produtividade e resolução de problemas técnicos.',
    stars: 5,
    badge: 'GRATUITO',
    tags: ['ChatGPT', 'AI', 'Automação', 'Produtividade', 'OpenAI'],
    link: 'https://www.udemy.com/course/ia-com-chatgpt-sem-enrolacao-do-zero-ao-essencial/?referralCode=AC46610BA618B97C14C8',
  },
  {
    image: '/img/Capa-02.png',
    title: 'Devops para Iniciantes',
    description: 'Este curso introdutório é o ponto de partida pra você aprender DevOps na prática. Vamos do terminal com Bash até a criação da sua primeira pipeline com GitHub Actions',
    stars: 5,
    badge: 'GRATUITO',
    tags: ['Github Actions', 'Bash', 'Devops'],
    link: 'https://www.udemy.com/course/devops-para-iniciantes-primeiros-passos-em-menos-de-2-horas/?referralCode=638ADE7A2C334ECE0B96',
  },
];

export default function CoursesSection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Explore nossos cursos</h2>
      <div className={styles.grid}>
        {courses.map((course, index) => (
          <div key={index} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img src={course.image} alt={course.title} />
              {course.badge && <span className={styles.badge}>{course.badge}</span>}
            </div>
            <div className={styles.stars}>
              {'★'.repeat(course.stars)}{'☆'.repeat(5 - course.stars)}
            </div>
            <h3 className={styles.title}>{course.title}</h3>
            <p className={styles.description}>{course.description}</p>

            <div className={styles.tags}>
              {course.tags.map((tag, i) => (
                <span key={i} className={styles.tag}>{tag}</span>
              ))}
            </div>

            <a href={course.link} className={styles.button} target="_blank" rel="noreferrer">
              Mais informações →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
