# Clima-Bot

Este é um projeto de Crawler de clima criado com a lib Puppeteer para NODE.


<!-- GETTING STARTED -->
## Getting Started

Para iniciar este projeto, siga as instruções a seguir:


### Prerequisitos

This is an example of how to list things you need to use the software and how to install them.
*Node v20.12.1 ou superior



## Instalação
_Dependencias._

1. Clone o repositorio deste projeto e execute:
   ```sh
   npm install
   ```
2. (Linux) Caso utilize linux, garanta que o Chromium esta instalado na máquuina ou instale com o comando:
   ```js
   sudo apt-get install chromium-browser
   ```

### Utilização

Após instalado, execute o arquivo bot.js para iniciar o servidor.

1. Acesse a rota: /clima/status para verificar o status do servidor. Exemplo:

**{"message":"server is up","status":200,"lastExec":"domingo, 1 de dezembro de 2024 às 11:47"}**


2. Para puxar as informaçoes de clima da cidade desejada, basta passar o nome da cidade no parametro da query string

**/clima?cidade=paris**




<p align="right">(<a href="#readme-top">back to top</a>)</p>
