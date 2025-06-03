import React from 'react';
import styles from './CoursesSection.module.css';

const courses = [
  {
    image: '/img/devops_automacao.png',
    title: 'Devops: Automação Sem Enrolação',
    description: 'Domine DevOps com automações reais, laboratórios práticos e sem enrolação. Aprenda na prática o que o mercado exige.',
    stars: 5,
    badge: 'BESTSELLER', // Adicionado o selo para funcionar
    tags: ['Iniciante', 'Curso rápido'],
    link: 'https://www.udemy.com/course/devops-automacao-sem-enrolacao/?referralCode=28E4F89140C44D63D605', // Link adicionado
  },
  {
    image: '/img/em_ breve.png',
    title: 'Preparando algo incrível!',
    description: 'Este curso está sendo construído para te entregar o melhor conteúdo sobre DevOps e Cloud. Fica de olho!',
    stars: 5,
    badge: '',
    tags: ['Intermediário', 'CKA', 'Kubernetes'],
    link: '#',
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
