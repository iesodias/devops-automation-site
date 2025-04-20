import React from 'react';
import styles from './CoursesSection.module.css';

const courses = [
  {
    image: '/img/Capa-01.png',
    title: 'Devops: Automação sem enrolação',
    description: 'Aprenda DevOps de verdade com um curso prático e rápido, focado em automação, CI/CD, infraestrutura como código e muito mais',
    stars: 5,
    badge: 'BESTSELLER',
    tags: ['Iniciante', 'Curso rápido'],
    link: '#',
  },
  {
    image: '/img/Capa-01.png',
    title: 'Devops: Automação sem enrolação',
    description: 'Everything you need to master the Certified Kubernetes Administrator (CKA) exam',
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
