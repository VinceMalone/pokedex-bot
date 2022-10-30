import jaroWinkler from "talisman/metrics/jaro-winkler.js";

import pokedex from "./pokedex.csv";

function getPokemon(identifier) {
  const isNumber = /^\d+$/.test(identifier);
  const pokemon = isNumber
    ? getPokemonById(identifier)
    : getPokemonByName(identifier);
  return pokemon;
}

function getPokemonById(id) {
  return pokedex.find((pokemon) => pokemon.pokedex_number === id);
}

function getPokemonByName(name) {
  const results = pokedex
    .map((pokemon) => [jaroWinkler(pokemon.name, name), pokemon])
    .sort(([a], [b]) => b - a);

  console.log(
    `Couldn't find pokemon "${name}" — here's the top ten closest`,
    results.slice(0, 10)
  );

  const [, closestPokemon] = results[0];

  console.log(`Can't find "${name}" — did you mean "${closestPokemon.name}"?`);

  return closestPokemon;
}

exports.handler = (event, context, callback) => {
  const { query } = event.queryStringParameters;
  const pokemon = getPokemon(query || "");

  console.log("query", query);
  console.log("event.queryStringParameters", event.queryStringParameters);
  // console.log("event", event);

  const output =
    pokemon == null
      ? {
          status: "404",
          result: "Pokemon not found",
        }
      : {
          status: "200",
          result: pokemon,
        };

  console.log("output", output);

  return callback(null, {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(output),
  });
};
