import { useEffect } from 'react';

export default function Redirect() {
  useEffect(() => {
    window.location.href = 'https://www.udemy.com/course/devops-automacao-sem-enrolacao/?couponCode=8B8F0D4E39EF8743714B';
  }, []);

  return <p>Redirecionando para o curso na Udemy!</p>;
}
