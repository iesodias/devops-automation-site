import React from 'react';
import styles from './CustomFooter.module.css';

export default function CustomFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

{/* Coluna 1 */}
<div>
  <img src="/img/devops-logo.png" alt="Logo" className={styles.logo} />
  <p className={styles.follow}>Siga nas redes</p>
  <ul className={styles.socialList}>
    <li>
      <a href="https://www.youtube.com/channel/UCxRNzCKgqQ0FW0GKuRSjlEQ" target="_blank" rel="noopener noreferrer">
        <img src="/img/logos_youtube-icon.avif" alt="YouTube" />
        <span>iesodias</span>
      </a>
    </li>
    <li>
      <a href="https://linkedin.com/in/iesodias" target="_blank" rel="noopener noreferrer">
        <img src="/img/devicon_linkedin.avif" alt="LinkedIn" />
        <span>iesodias</span>
      </a>
    </li>
    <li>
      <a href="https://instagram.com/iesofdias" target="_blank" rel="noopener noreferrer">
        <img src="/img/skill-icons_instagram.avif" alt="Instagram" />
        <span>iesofdias</span>
      </a>
    </li>
  </ul>
</div>


        {/* Coluna 2 */}
        <div>
          <p className={styles.newsletterTitle}>Dúvidas?</p>
          <p className={styles.email}>Fale Comigo <br /><a href="mailto:iesodias@gmail.com">iesodias@gmail.com</a></p>
        </div>

        {/* Coluna 3 */}
        <div>
          <p className={styles.sectionTitle}>Links rápidos</p>
          <ul className={styles.linkList}>
            <li><a href="#">Github</a></li>
            <li><a href="#">Youtube</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>

        {/* Coluna 4 */}
        <div>
          <p className={styles.sectionTitle}>Legal</p>
          <ul className={styles.linkList}>
            <li><a href="#">Termos</a></li>
            <li><a href="#">Privacidade</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
