// Integração com a Rick and Morty API usando Fetch e criação dinâmica de cards.
const API_URL = "https://rickandmortyapi.com/api/character";

const characterGrid = document.querySelector("#characterGrid");
const loadingState = document.querySelector("#loadingState");
const errorState = document.querySelector("#errorState");
const resultsLine = document.querySelector("#resultsLine");
const loadMoreButton = document.querySelector("#loadMoreButton");
const retryButton = document.querySelector("#retryButton");
const searchInput = document.querySelector("#searchInput");
const filterButtons = document.querySelectorAll(".filter");

let nextPageUrl = API_URL;
let characters = [];
let selectedStatus = "all";
let isLoading = false;

const statusLabels = { Alive: "Vivo", Dead: "Morto", unknown: "Desconhecido" };

async function loadCharacters(url = API_URL, append = false) {
  if (isLoading || !url) return;
  isLoading = true;
  loadingState.hidden = false;
  errorState.hidden = true;
  loadMoreButton.hidden = true;

  try {
    // fetch faz a requisição HTTP; response.json() transforma a resposta em objeto JavaScript.
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
    const data = await response.json();

    nextPageUrl = data.info.next;
    characters = append ? [...characters, ...data.results] : data.results;
    renderCharacters();
    resultsLine.textContent = `${characters.length} personagens carregados • dados da API`;
    loadMoreButton.hidden = !nextPageUrl;
  } catch (error) {
    console.error("Não foi possível carregar os personagens:", error);
    errorState.hidden = false;
    resultsLine.textContent = "Não foi possível conectar à API.";
  } finally {
    isLoading = false;
    loadingState.hidden = true;
  }
}

function createCharacterCard(character) {
  // Cada card é construído via JavaScript; nenhum card fica fixo no HTML.
  const card = document.createElement("article");
  card.className = "character-card";

  const imageWrap = document.createElement("div");
  imageWrap.className = "character-image-wrap";

  const image = document.createElement("img");
  image.className = "character-image";
  image.src = character.image;
  image.alt = `Imagem de ${character.name}`;
  image.loading = "lazy";
  imageWrap.appendChild(image);

  const status = document.createElement("span");
  status.className = "status-pill";
  if (character.status === "Alive") status.classList.add("alive");
  if (character.status === "Dead") status.classList.add("dead");
  status.textContent = statusLabels[character.status] || "Desconhecido";
  imageWrap.appendChild(status);

  const content = document.createElement("div");
  content.className = "card-content";

  const name = document.createElement("h3");
  name.textContent = character.name;

  const meta = document.createElement("div");
  meta.className = "card-meta";
  meta.append(
    createMetaItem("Espécie", character.species || "Não informada"),
    createMetaItem("Origem", character.origin?.name || "Desconhecida"),
    createMetaItem("Gênero", character.gender || "Não informado")
  );

  content.append(name, meta);
  card.append(imageWrap, content);
  return card;
}

function createMetaItem(labelText, valueText) {
  const row = document.createElement("div");
  row.className = "meta-item";
  const label = document.createElement("span");
  label.textContent = labelText;
  const value = document.createElement("strong");
  value.textContent = valueText;
  row.append(label, value);
  return row;
}

function renderCharacters() {
  const searchTerm = searchInput.value.trim().toLocaleLowerCase("pt-BR");
  const filtered = characters.filter((character) => {
    const matchesSearch = character.name.toLocaleLowerCase("pt-BR").includes(searchTerm);
    const matchesStatus = selectedStatus === "all" || character.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // appendChild adiciona os elementos criados ao DOM.
  characterGrid.replaceChildren();
  const fragment = document.createDocumentFragment();

  filtered.forEach((character) => {
    fragment.appendChild(createCharacterCard(character));
  });
  characterGrid.appendChild(fragment);

  if (characters.length > 0 && filtered.length === 0) {
    const empty = document.createElement("p");
    empty.className = "results-line";
    empty.textContent = "Nenhum personagem encontrado com esses filtros.";
    characterGrid.appendChild(empty);
  }
  resultsLine.textContent = `${filtered.length} personagem(ns) exibido(s) • ${characters.length} carregados`;
}

searchInput.addEventListener("input", renderCharacters);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    selectedStatus = button.dataset.status;
    renderCharacters();
  });
});

loadMoreButton.addEventListener("click", () => loadCharacters(nextPageUrl, true));
retryButton.addEventListener("click", () => loadCharacters(API_URL));
loadCharacters();
