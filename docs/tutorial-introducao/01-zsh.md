---
sidebar_position: 1
---

# Guia de Instalação do Zsh e Oh My Zsh no Ubuntu

### Pré-requisitos:
- Uma máquina Ubuntu ou distribuição baseada em Debian.
- Permissões de superusuário (`root` ou `sudo`).

### Etapa 1: Instalar o Zsh
Instale o Zsh, um shell poderoso com suporte a temas e plugins:
```bash
sudo apt update
sudo apt install zsh -y
```

### Etapa 2: Definir o Zsh como shell padrão
Torne o Zsh o shell padrão com o seguinte comando:
```bash
chsh -s $(which zsh)
```
Efetue logout e login novamente para aplicar a mudança.

### Etapa 3: Instalar o Oh My Zsh
Oh My Zsh é um framework para gerenciar a configuração do Zsh com temas e plugins:
```bash
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

### Etapa 4: Configurar o Oh My Zsh
Altere o tema padrão editando o arquivo `~/.zshrc`:
```bash
nano ~/.zshrc
```
Localize esta linha:
```zsh
ZSH_THEME="robbyrussell"
```
Altere "robbyrussell" para qualquer tema da sua escolha, listado na [página de temas do Oh My Zsh](https://github.com/ohmyzsh/ohmyzsh/wiki/Themes).

### Etapa 5: Instalar plugins para o Oh My Zsh (opcional)
Clone o repositório do plugin dentro de `~/.oh-my-zsh/custom/plugins/` e adicione o nome ao array de plugins em `~/.zshrc`.
Exemplo com `zsh-syntax-highlighting`:
```bash
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
```
No `~/.zshrc`, adicione:
```zsh
plugins=(... zsh-syntax-highlighting)
```
Salve e feche o arquivo, depois aplique:
```bash
source ~/.zshrc
```

### Etapa 6: Instalar o Spaceship Prompt como tema
Spaceship é um tema moderno e informativo para o Zsh.

### 6.1 Instalar o Git (se ainda não estiver instalado):
```bash
sudo apt-get install git
```

### 6.2 Clonar o repositório do Spaceship:
```bash
git clone https://github.com/denysdovhan/spaceship-prompt.git "$ZSH_CUSTOM/themes/spaceship-prompt"
```

### 6.3 Criar link simbólico para o tema:
```bash
ln -s "$ZSH_CUSTOM/themes/spaceship-prompt/spaceship.zsh-theme" "$ZSH_CUSTOM/themes/spaceship.zsh-theme"
```

### 6.4 Editar o `.zshrc` para definir o tema:
Com VS Code:
```bash
code ~/.zshrc
```
Ou usando `vi`:
```bash
vi ~/.zshrc
```

### 6.5 Configurar o tema Spaceship:
Adicione ao final do `.zshrc`:
```zsh
ZSH_THEME="spaceship"

SPACESHIP_PROMPT_ORDER=(
  user
  dir
  host
  git
  hg
  exec_time
  line_sep
  vi_mode
  jobs
  exit_code
  char
)
SPACESHIP_USER_SHOW=always
SPACESHIP_PROMPT_ADD_NEWLINE=false
SPACESHIP_CHAR_SYMBOL="❯"
SPACESHIP_CHAR_SUFFIX=" "
```

Com isso, seu terminal estará estilizado e pronto para produtividade com Zsh e Oh My Zsh! 🚀