import fetch from "node-fetch";

export class FetchError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = "FetchError";
  }
}

async function fetchPokemonBase(name) {
  const identifier = name.toLowerCase();

  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${identifier}`
  );

  if (response.status === 404) {
    throw new FetchError(404, `A pokedex entry for "${name}" was not found`);
  }

  if (!response.ok) {
    throw new FetchError(
      response.status,
      `Pokedex lookup for "${name}" failed — go to a Pokémon Center`
    );
  }

  const data = await response.json();

  return [data, response];
}

async function fetchPokemonSpecies(name) {
  const identifier = name.toLowerCase();

  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${identifier}`
  );

  if (response.status === 404) {
    throw new FetchError(404, `A pokedex entry for "${name}" was not found`);
  }

  if (!response.ok) {
    throw new FetchError(
      response.status,
      `Pokedex lookup for "${name}" failed — go to a Pokémon Center`
    );
  }

  const data = await response.json();

  return [data, response];
}

export async function fetchPokemon(name) {
  const [species] = await fetchPokemonSpecies(name);
  const [base] = await fetchPokemonBase(`${species.id}`);

  return {
    ...base,
    species,
  };
}
