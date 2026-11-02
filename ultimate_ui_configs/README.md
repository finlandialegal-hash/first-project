# Configurações do HUD e Menus Estilo Roblox para Ultimate UI

Este conjunto de arquivos foi desenvolvido para o plugin **Ultimate UI** (Minecraft) e para o editor web oficial (`xqedii.dev/ultimateui/editor`).

> **Aviso de Propriedade Intelectual:** Este layout foi desenhado do zero com design moderno e neutro sem utilizar nenhuma marca registrada, logotipo, textura ou asset proprietário do Roblox.

## Arquivos Inclusos

1. `hud.yml` - HUD principal em jogo (Barra superior estilo Roblox com botões interativos, barra de vida dinâmica, mini-card de perfil e hotbar inferior 1-9 slots).
2. `escape_menu.yml` - Menu ESC/Pausa com navegação por abas (Início, Jogadores, Avatar, Configurações, Ajuda) e botões de ação (Retomar, Reiniciar Personagem, Sair).
3. `avatar_menu.yml` - Menu de personalização de Avatar (Preview do personagem, paleta de cores para pele, roupas, acessórios e animações/emotes).
4. `home_menu.yml` - Hub de modos de jogo / Descobrir estilo catálogo.

## Como Usar no Servidor Minecraft

1. Certifique-se de que o plugin **Ultimate UI** está instalado em seu servidor (Spigot/Paper 1.16+).
2. Vá até a pasta do seu servidor: `plugins/UltimateUI/`.
3. Copie o arquivo `hud.yml` para `plugins/UltimateUI/huds/`.
4. Copie os arquivos `escape_menu.yml`, `avatar_menu.yml` e `home_menu.yml` para `plugins/UltimateUI/menus/`.
5. Execute o comando `/uui reload` ou reinicie o servidor.

## Como Usar no Web Editor (xqedii.dev/ultimateui/editor)

1. Acesse o editor em [xqedii.dev/ultimateui/editor](https://xqedii.dev/ultimateui/editor).
2. Clique em **Import** / **Importar YAML**.
3. Selecione qualquer um dos arquivos `.yml` acima para visualizar e editar graficamente cada elemento no canvas do editor.
