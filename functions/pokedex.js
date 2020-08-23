import { formatMessage } from "./format";
import { searchById, searchByName } from "./dex";
import pokedex from "./pokedex.csv";

function getPokemon(identifier) {
  const isNumber = /^\d+$/.test(identifier);
  const pokemon = isNumber
    ? searchById(pokedex, identifier)
    : searchByName(pokedex, identifier);
  return pokemon;
}

exports.handler = (event, context, callback) => {
  const { query } = event.queryStringParameters;
  const pokemon = getPokemon(query || "");

  const message =
    pokemon.length > 0
      ? pokemon.map(formatMessage).join(" ———— ")
      : `Can't find "${query}"`;

  return callback(null, {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "text/plain",
    },
    body: message,
  });
};
