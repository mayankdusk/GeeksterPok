// first i need to get types of pokemon like window, fire etc (for the drop down in top of the page)

const pokemonTypes = async () => {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/type", {
      method: "GET",
    });
    const pokTypes = await response.json();
    const pokCategory = pokTypes.results.map((category) => category.name);
    return pokCategory;
  } catch (e) {
    console.log(e);
  }
};

async function renderPokemonTypes() {
  const itemsTOBeAdded = await pokemonTypes();

  itemsTOBeAdded.forEach((element) => {
    let htmlElementTOBeAdded = `<option value="${element}">${element}</option>`;
    document.getElementById("pokTypes").innerHTML += htmlElementTOBeAdded;
  });
}

renderPokemonTypes();

// get me details of pokemon with given id
const fetchPokemonDetails = (id) => {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((response) =>
    response.json()
  );
};

const arrayOfPokemonDetailPromises = [];

for (let i = 1; i <= 150; i++) {
  const pokemonPromise = fetchPokemonDetails(i);
  arrayOfPokemonDetailPromises.push(pokemonPromise);
}

const createPokemonCard = (pokemon) => {
  const card = `
    <div class="flip-card" id="${pokemon.name}">
    <div class="flip-card-inner" id="${pokemon.types[0].type.name}">
        <div class="front-pokemon-card">

            <img src="${
              pokemon.sprites.front_default
            }" class="front-pokemon-image">
            <p class="front-poke-id">#${pokemon.id}</p>
            <h2><a href="/pokemon.html?pokemon_id=1">${
              pokemon.name
            }</a></h2><p></p>
            <p class="front-pokemon-type">${pokemon.types[0].type.name}</p>
        </div>
            
        <div class="back-pokemon-card">
                <h1></h1>
                <p class="back-poke-id">#${pokemon.id}</p>
                <h2 class="back-pokemon-name">${pokemon.name}</h2>
                <p class="back-pokemon-abilities"><p>Abilities:${pokemon.abilities
                  .map((ability) => ability.ability.name)
                  .join(", ")}</p>
        </div>
    </div>
    </div>
    `;
  return card;
};

let pokemonList = [];
const pokemonContainer = document.getElementById("cardAll");

Promise.all(arrayOfPokemonDetailPromises).then((pokemonDetails) => {
  pokemonList = pokemonDetails;
  pokemonDetails.forEach((pokemon) => {
    const pokemonCard = createPokemonCard(pokemon);
    pokemonContainer.innerHTML += pokemonCard;
  });
});

const searchInput = document.getElementById("pokemon-search-input");
searchInput.addEventListener("keyup", (e) => {
  const filteredPokemonList = pokemonList.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(e.target.value.toLowerCase())
  );
  pokemonContainer.innerHTML = "";
  filteredPokemonList.forEach((pokemon) => {
    const pokemonCard = createPokemonCard(pokemon);
    pokemonContainer.innerHTML += pokemonCard;
  });
});
