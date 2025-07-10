---
id: data-block
title: Aula 8 - Bloco data no Terraform
noindex: true
---

# Bloco `data` no Terraform

## Introdução

No Terraform, além de criar recursos, também é comum precisarmos **consultar dados existentes** em provedores de nuvem. Para isso, usamos o bloco `data`. Ele permite acessar informações que já estão criadas, como redes virtuais, imagens, grupos de recursos, entre outros.

Este recurso é muito últil quando você quer usar elementos que já existem no ambiente Azure, mas não quer (ou não pode) criá-los novamente.

## O que é o bloco `data`

O bloco `data` é um tipo especial de bloco no Terraform usado para **consultar dados externos** de um provedor. Diferente dos blocos `resource`, que criam infraestrutura, os blocos `data` apenas leem e importam dados para uso dentro do código.

## Explicação técnica

* Um `data` precisa de dois argumentos principais: **tipo** e **nome do recurso**.
* O conteúdo do `data` define os filtros e parâmetros para buscar o recurso.
* Depois que o dado é lido, você pode usá-lo com `data.<tipo>.<nome>.atributo`

Exemplo de sintaxe:

```hcl
data "azurerm_resource_group" "rg" {
  name = "meu-resource-group"
}
```

## Comando(s) usados

Para aplicar e visualizar dados:

```bash
terraform init
terraform plan
terraform apply
```

## Exemplo prático

Vamos usar um bloco `data` para buscar um grupo de recursos já existente no Azure e usar uma imagem existente da galeria para criar uma máquina virtual:

```hcl
provider "azurerm" {
  features {}
}

data "azurerm_resource_group" "rg" {
  name = "meu-resource-group"
}

data "azurerm_shared_image" "ubuntu_image" {
  name                = "UbuntuLTS"
  gallery_name        = "MinhaGaleria"
  resource_group_name = data.azurerm_resource_group.rg.name
}

resource "azurerm_linux_virtual_machine" "vm" {
  name                = "vm-exemplo"
  resource_group_name = data.azurerm_resource_group.rg.name
  location            = data.azurerm_resource_group.rg.location
  size                = "Standard_B1s"
  admin_username      = "azureuser"

  network_interface_ids = [
    azurerm_network_interface.nic.id
  ]

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
    name                 = "osdisk"
  }

  source_image_id = data.azurerm_shared_image.ubuntu_image.id
  disable_password_authentication = true

  admin_ssh_key {
    username   = "azureuser"
    public_key = file("~/.ssh/id_rsa.pub")
  }
}
```

## Output esperado

Ao rodar `terraform apply`, você deve ver algo como:

```bash
Apply complete! Resources: 1 added, 0 changed, 0 destroyed.

Outputs:
azurerm_linux_virtual_machine.vm:
  id = "/subscriptions/xxx/resourceGroups/meu-resource-group/providers/Microsoft.Compute/virtualMachines/vm-exemplo"
  name = "vm-exemplo"
  location = "eastus"
  size = "Standard_B1s"
```

## Melhores práticas

* Sempre verifique os filtros usados nos blocos `data` para evitar retornar dados errados.
* Evite hardcode de nomes e IDs — prefira referenciar com `data`.
* Use `depends_on` quando o dado depender de um recurso criado em tempo de execução.
* Documente o motivo de uso de cada bloco `data` no código.

O uso correto do bloco `data` com Azure permite integrar recursos existentes ao seu código Terraform, melhorando a reutilização e mantendo a infraestrutura sincronizada com o que já está em produção.
