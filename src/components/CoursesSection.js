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
