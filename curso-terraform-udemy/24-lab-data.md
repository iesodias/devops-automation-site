---
id: lab-6-data
title: Lab 6 - Criando uma Máquina Virtual no Azure com uso de bloco `data`
noindex: true
---

# Lab: Criando uma Máquina Virtual no Azure com uso de bloco `data`

## Introdução
Este laboratório demonstra como criar uma máquina virtual Linux no Azure usando Terraform 1.12.2, aproveitando recursos já existentes através do uso do bloco `data`. O grupo de recursos será criado via Azure CLI, e suas informações acessadas com `data.azurerm_resource_group`. Todos os demais recursos (VNet, Subnet, IP público, NIC e VM) serão criados via Terraform.

## Pré-requisitos
- Terraform 1.12.2 instalado
- Conta Azure configurada com `az login`
- Grupo de recursos existente criado com Azure CLI

```bash
export ARM_SUBSCRIPTION_ID="subscription_id"
```

## Etapas Iniciais
1. Crie um diretório para seu projeto:
```bash
mkdir lab-vm-azure && cd lab-vm-azure
```

2. Crie os arquivos conforme a estrutura abaixo:
```bash
touch main.tf variables.tf outputs.tf provider.tf
```

3. Verifique a estrutura do diretório:
```bash
tree
```
Saída esperada:
```
lab-vm-azure/
├── main.tf
├── variables.tf
├── outputs.tf
├── provider.tf
```

## Criar Resource Group com Azure CLI
```bash
az group create --name devops-automation-rg --location eastus
```

## Arquivo: provider.tf
```terraform
provider "azurerm" {
  features {}
}
```

## Arquivo: variables.tf
```terraform
variable "admin_username" {
  description = "Nome de usuário para login na VM"
  default     = "azureuser"
}

variable "admin_password" {
  description = "Senha para login na VM"
  sensitive   = true
  default     = "SenhaForte123!"
}

variable "location" {
  description = "Localização dos recursos"
  default     = "eastus"
}

variable "resource_group_name" {
  description = "Nome do Resource Group já existente"
  default     = "devops-automation-rg"
}
```

## Arquivo: main.tf
```terraform
data "azurerm_resource_group" "rg" {
  name = var.resource_group_name
}

resource "azurerm_virtual_network" "vnet" {
  name                = "devopsautomation-vnet"
  address_space       = ["10.0.0.0/16"]
  location            = data.azurerm_resource_group.rg.location
  resource_group_name = data.azurerm_resource_group.rg.name
}

resource "azurerm_subnet" "subnet" {
  name                 = "devopsautomation-subnet"
  resource_group_name  = data.azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = ["10.0.1.0/24"]
}

resource "azurerm_public_ip" "public_ip" {
  name                = "devopsautomation-public-ip"
  location            = data.azurerm_resource_group.rg.location
  resource_group_name = data.azurerm_resource_group.rg.name
  allocation_method   = "Static"
  sku                 = "Standard"
}

resource "azurerm_network_interface" "nic" {
  name                = "devopsautomation-nic"
  location            = data.azurerm_resource_group.rg.location
  resource_group_name = data.azurerm_resource_group.rg.name

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.subnet.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.public_ip.id
  }
}

resource "azurerm_linux_virtual_machine" "vm" {
  name                = "devopsautomation-vm"
  location            = data.azurerm_resource_group.rg.location
  resource_group_name = data.azurerm_resource_group.rg.name
  size                = "Standard_B1s"
  admin_username      = var.admin_username
  admin_password      = var.admin_password
  disable_password_authentication = false

  network_interface_ids = [azurerm_network_interface.nic.id]

  os_disk {
    name                 = "devopsautomation-osdisk"
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "18.04-LTS"
    version   = "latest"
  }
}
```

## Arquivo: outputs.tf
```terraform
output "vm_name" {
  value = azurerm_linux_virtual_machine.vm.name
}

output "public_ip" {
  value = azurerm_public_ip.public_ip.ip_address
}
```

## Comandos Terraform
```bash
terraform init    # Inicializa o diretório e baixa plugins
terraform plan    # Mostra o plano de execução com os recursos que serão criados
terraform apply   # Aplica o plano e cria os recursos
```

## Resultado Esperado
- Máquina virtual criada
- IP público atribuído
- Interface de rede conectada
- VNet e Subnet criadas
- Nome e IP exibidos como saída

## Dicas e Boas Práticas
- Use variáveis para tudo que pode mudar entre ambientes
- Evite hardcode de nomes ou IDs — sempre que possível, use `data`
- Separe os arquivos para melhor organização
- Proteja senhas usando `sensitive = true`
- Adicione `.gitignore` para evitar versionamento de arquivos sensíveis
