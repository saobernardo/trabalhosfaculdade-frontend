# Multiverso — Rick and Morty

Projeto acadêmico de front-end feito com HTML, CSS e JavaScript puro.

## Como executar
1. Extraia a pasta do projeto.
2. Abra `index.html` no navegador. Se o navegador bloquear requisições locais, execute um servidor simples, por exemplo a extensão Live Server do VS Code.
3. É necessária conexão com a internet para consultar a API e carregar as fontes.

## Funcionalidades
- Consumo da Rick and Morty API com `fetch`.
- Cards criados dinamicamente com `document.createElement` e `appendChild`.
- Busca por nome.
- Filtros por status (vivo, morto ou desconhecido).
- Botão para carregar a próxima página de resultados.
- Layout responsivo sem frameworks.

## API
Documentação: https://rickandmortyapi.com/documentation
Endpoint inicial: https://rickandmortyapi.com/api/character

## Estrutura
- `index.html` — estrutura da página.
- `style.css` — identidade visual e responsividade.
- `script.js` — integração da API e manipulação do DOM.
