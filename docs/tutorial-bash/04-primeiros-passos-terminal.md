---
sidebar_position: 4
---

# Domine o Terminal para Cloud e DevOps

👉 Veja meu curso da Udemy: [Curso DevOps na Prática](https://devopsautomation.com.br/go/udemy-cupom)

Se você está começando do **zero** em Cloud ⁄ DevOps e sente aquele frio na barriga só de imaginar abrir o temido terminal preto cheio de comandos… respira fundo

Eu já estive aí — perdido sem saber por onde começar Mas hoje trabalhando na área posso garantir: **dominar o terminal e o Linux é o pulo do gato** que vai destravar suas primeiras oportunidades E não é nenhum bicho de sete cabeças

---

## Por que o Terminal é **tão** importante em DevOps?

Em Cloud ⁄ DevOps quase tudo acontece fora das interfaces gráficas Você vai:

* Provisionar servidores na nuvem
* Automatizar deploys
* Gerenciar containers

> **Spoiler:** mais de **90 %** disso rola via linha de comando

Quem domina o terminal ganha:

* **Controle total** sobre servidores (geralmente Linux)
* **Automação** de tarefas repetitivas com scripts
* **Agilidade:** um comando faz em segundos o que um clique levaria minutos

---

## Ativando o Terminal: Windows & Mac

### Windows

1. **Win + R** → `cmd` → Enter
2. **PowerShell**: Menu Iniciar → digite *PowerShell* → Enter
3. Quer um terminal Linux dentro do Windows? Use o **WSL** (Windows Subsystem for Linux)

#### Instalando o WSL (Windows Subsystem for Linux)

```powershell
# Abra o PowerShell **como Administrador** e execute:
wsl --install
```

Depois de reiniciar:

1. Escolha a distribuição Linux (recomendo **Ubuntu**)
2. Abra o Ubuntu no Menu Iniciar
3. Atualize os pacotes:

```bash
sudo apt update && sudo apt upgrade -y
```

### Mac

1. **Cmd + Espaço** → digite *Terminal* → Enter
2. Launchpad → pasta **Outros** → **Terminal**

---

## Seu Primeiro Contato com o Linux

Ainda não precisa instalar nada Basta usar:

* O **WSL** no Windows
* O **terminal bash** que já vem no Mac

```bash
ls            # lista arquivos na pasta atual
cd pasta/     # entra na pasta "pasta" (ex: cd Documentos)
pwd           # mostra onde você está no sistema
mkdir teste   # cria a pasta "teste"
cat arquivo.txt  # exibe o conteúdo do arquivo
```

Quer ajuda? Use `man <comando>` (ex: `man ls`) — o manual explica **tudo** sobre o comando

---

## Terminais na Nuvem (Cloud Shell)

* **Azure Cloud Shell**: basta acessar [https://shell.azure.com](https://shell.azure.com) ou clicar no ícone `>` no portal do Azure para obter um bash ou PowerShell pronto com todos os SDKs configurados
* **AWS CloudShell**: disponível no console da AWS (ícone de terminal) oferece um bash com AWS CLI já autenticado na sua conta

> Perfeito para praticar comandos sem instalar nada localmente

---

## Dicas para Perder o Medo

* **Tab** é seu melhor amigo: digite parte do nome e aperte Tab para autocompletar
* Experimente Linux de verdade:

  * Crie uma VM no **VirtualBox** e instale **Ubuntu**
  * Use as **camadas grátis** da AWS ou Azure
* Pratique **todo dia**: crie pastas mova arquivos instale programas (`sudo apt install <pacote>`)
  Errou? Google + fóruns salvam!

---

## Conclusão

Quando migrei para Linux travava em tudo Hoje navego por servidores apenas com o teclado — é libertador

No mundo DevOps isso te coloca **à frente de 70 %** dos iniciantes

> "Mas eu não sei nada de programação…"

Comece com **shell script** (bash) Automatize tarefas simples (backup de arquivos) Depois evolua para Terraform Kubernetes e além

---

## Exercício de Hoje

1. Abra o terminal
2. Entre na pasta Documentos
   `cd Documentos`
3. Crie a pasta **devops-jornada**
   `mkdir devops-jornada`
4. Liste o conteúdo dentro dela (ainda vazia)
   `ls devops-jornada`

Pronto! Seu **primeiro comando de infraestrutura**
Repita um comando por dia e em 3 meses você vai se surpreender com o que consegue fazer

---

## Próximo Nível: Acelere Seu Aprendizado

Se quer **pegar um atalho** e dominar DevOps mais rápido, inscreva‑se agora no meu curso completo **DevOps: Automação Sem Enrolação** na Udemy. É 100 % mão na massa e direto ao ponto.

👉 [Garanta sua vaga aqui](https://www.udemy.com/course/devops-automacao-sem-enrolacao/?referralCode=28E4F89140C44D63D605)

Depois de assistir às aulas, volte e conte nos comentários como o curso impulsionou sua jornada. Bora continuar crescendo juntos!
