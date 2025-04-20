---
sidebar_position: 2
---

# Instalando o Docker no Ubuntu

Neste lab, você aprenderá como instalar o Docker no Ubuntu. Siga os passos abaixo:

### Etapa 1: Adicionar a chave GPG oficial do Docker

```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
```

Este comando adiciona a chave GPG oficial do Docker para garantir a autenticidade dos pacotes durante a instalação.

### Etapa 2: Configurar o repositório do Docker

```bash
echo \
  "deb [arch=\"\$(dpkg --print-architecture)\" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  \$(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

Esse comando configura o repositório oficial do Docker, permitindo que o `apt` busque os pacotes.

### Etapa 3: Instalar o Docker Engine, containerd e Docker Compose

```bash
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Esse passo atualiza os pacotes e instala o Docker Engine, containerd e o Docker Compose. O Docker Engine é o núcleo, enquanto o Compose permite definir aplicações com várias imagens.

### Etapa 4: Adicionar o usuário ao grupo docker

```bash
sudo groupadd docker
sudo usermod -aG docker $USER
```

Isso permite que você execute comandos Docker sem precisar de `sudo` o tempo todo.

### Etapa 5: Reiniciar o sistema

```bash
sudo reboot
```

Reinicie seu sistema para aplicar as mudanças.

### Etapa 6: Testar a instalação do Docker

```bash
docker run hello-world
```

Esse comando testa se o Docker foi instalado com sucesso.

Você agora está pronto para usar o Docker para criar e executar containers. Para mais informações, acesse a [documentação oficial do Docker](https://docs.docker.com/).

---

# Lab: Instalando o Docker no Windows

Neste lab, você aprenderá como instalar o Docker no Windows. Siga os passos abaixo:

### Etapa 1: Instalar o Docker Desktop

1. Baixe o Docker Desktop para Windows no site oficial: [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop).
2. Execute o instalador e siga as instruções.
3. Após a instalação, abra o Docker Desktop pelo menu Iniciar.

### Etapa 2: Testar a instalação do Docker

1. Abra um prompt de comando ou PowerShell.
2. Execute o seguinte comando:

```powershell
docker --version
```

Você deve ver a versão do Docker, confirmando a instalação.

### Etapa 3: Rodar um container Docker

```powershell
docker run hello-world
```

Esse comando baixa e roda um container de teste.

---

# Lab: Instalando o Docker no macOS

Neste lab, você aprenderá como instalar o Docker no macOS. Siga os passos abaixo:

### Etapa 1: Instalar o Docker Desktop para Mac

1. Baixe o Docker Desktop para Mac: [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
2. Abra o arquivo `.dmg` baixado.
3. Arraste o ícone do Docker para a pasta de Aplicativos.
4. Inicie o Docker Desktop a partir dos Aplicativos.

### Etapa 2: Testar a instalação

Abra o terminal e execute:

```bash
docker --version
```

### Etapa 3: Rodar um container de teste

```bash
docker run hello-world
```

Esse comando testa se o Docker está funcionando corretamente.