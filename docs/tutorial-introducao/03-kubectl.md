---
sidebar_position: 3
---

# Instalando e Verificando o kubectl

### Pré-requisitos:
- Você deve ter acesso ao terminal em um sistema baseado em Linux.
- O `curl` deve estar instalado para baixar o `kubectl`.
- Você precisa de permissão `sudo` para mover o binário para um diretório do seu PATH.

### Etapa 1: Baixar o kubectl

Baixe a versão estável mais recente do binário `kubectl` usando o curl:

```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
```

### Etapa 2: Tornar o kubectl executável

Altere as permissões do arquivo para torná-lo executável:

```bash
chmod +x ./kubectl
```

### Etapa 3: Mover o binário para o PATH

Mova o `kubectl` para `/usr/local/bin/`, que geralmente está incluído no PATH do sistema:

```bash
sudo mv ./kubectl /usr/local/bin/kubectl
```

### Etapa 4: Verificar a instalação

Verifique se o `kubectl` foi instalado corretamente conferindo sua versão:

```bash
kubectl version --client
```

Se as informações da versão forem exibidas corretamente, o `kubectl` está pronto para ser usado com seu cluster Kubernetes.

**Nota:** O caminho para o `kubeconfig` pode variar de acordo com a forma como seu cluster Kubernetes está configurado.