import fs from "fs";

import parseCsv from "csv-parse/lib/sync.js";
import stringArgv from "string-argv";
import jaroWinkler from "talisman/metrics/jaro-winkler.js";
import yargs from "yargs";

import { fetchPokemon } from "./fetch.mjs";
import { getStatName, getTypeSymbol } from "./utils.mjs";

const pokedexCsv = fs.readFileSync("./pokedex.csv", "utf-8");
const pokedex = parseCsv(pokedexCsv, { columns: true });

function formatMessage(pokemon, args) {
  let message = `${pokemon.name} (№ ${pokemon.species.id})`;
  message += " ⋯ ";
  message += pokemon.types
    .map(({ type }) => getTypeSymbol(type.name))
    .join(" ");

  if (args.stats) {
    message += " ⋯ base stats: ";
    message += pokemon.stats
      .map(({ base_stat, stat }) => `${getStatName(stat.name)} ${base_stat}`)
      .join(", ");
  }

  if (args.abilities) {
    message += " ⋯ abilities: ";
    message += pokemon.abilities
      .map(
        ({ ability, is_hidden }) =>
          `${ability.name}${is_hidden ? " (hidden)" : ""}`
      )
      .join(", ");
  }

  return message;
}

async function pokedexLookup(pokemonName, args, context) {
  try {
    const pokemon = await fetchPokemon(pokemonName);
    const message = formatMessage(pokemon, args);
    context.say(message);
  } catch (error) {
    if (error.code === 404) {
      const results = pokedex
        .map(({ pokedex_number, name }) => [
          jaroWinkler(name, pokemonName),
          { pokedex_number, name },
        ])
        .sort(([a], [b]) => b - a);
      console.log(
        `Couldn't find pokemon "${pokemonName}" — here's the top ten closest`,
        results.slice(0, 10)
      );
      const [, closestPokemon] = results[0];
      context.say(
        `Can't find "${pokemonName}" — did you mean "${closestPokemon.name}"?`
      );
    } else if (error.name === "FetchError") {
      context.say(error.message);
    } else {
      console.error(error);
    }
  }
}

export function init(stdin, say) {
  const args = stringArgv.parseArgsStringToArgv(stdin);

  yargs
    .command({
      command: "!pokedex [pokemon..]",
      aliases: ["!dex"],
      builder: (yargs) => {
        yargs
          .positional("pokemon", {
            type: "string",
          })
          .option("stats", {
            alias: ["s", "stat"],
            type: "boolean",
          })
          .option("abilities", {
            alias: ["a", "ability"],
            type: "boolean",
          });
      },
      handler: async (argv) => {
        for (const pokemon of argv.pokemon) {
          await pokedexLookup(pokemon.toLowerCase(), argv, { say });
        }
      },
    })
    .help(false)
    .version(false)
    .parse(args);
}
