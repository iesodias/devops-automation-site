import { useEffect } from 'react';

export default function Redirect() {
  useEffect(() => {
    window.location.href = 'https://www.udemy.com/course/devops-automacao-sem-enrolacao/?couponCode=CA1E128B67B670F1B078';
  }, []);

  return <p>Redirecionando para o curso na Udemy!</p>;
}
