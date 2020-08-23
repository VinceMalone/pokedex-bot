import "core-js/features/array/flat-map";
import jaroWinkler from "talisman/metrics/jaro-winkler.js";

const identity = (x) => x;

function groupBy(input, keyMapper = identity, valueMapper = identity) {
  return input.reduce((output, entry, index) => {
    const key = keyMapper(entry, index);
    const value = valueMapper(entry, index);
    const group = output.get(key) || [];
    return output.set(key, [...group, value]);
  }, new Map());
}

export function searchById(list, id) {
  const results = [];
  for (const pokemon of list) {
    if (pokemon.pokedex_number === id) {
      results.push({
        ...pokemon,
        match: 1,
      });
    }
  }
  return results;
}

export function searchByName(list, name) {
  const rankedList = list
    .map((pokemon) => ({
      ...pokemon,
      match: jaroWinkler(pokemon.name.toLowerCase(), name.toLowerCase()),
    }))
    .sort((a, b) => b.match - a.match);

  const groupedById = groupBy(rankedList, (pokemon) => pokemon.pokedex_number);
  const [headList] = Array.from(groupedById.values());
  return headList;
}
