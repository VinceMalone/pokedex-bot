function formatTypesMessage(pokemon) {
  return [pokemon.type_1, pokemon.type_2].filter(Boolean).join(" / ");
}

function formatStatsMessage(pokemon) {
  const statMap = [
    ["HP", "hp"],
    ["Atk", "attack"],
    ["Def", "defense"],
    ["SpA", "sp_attack"],
    ["SpD", "sp_defense"],
    ["Spe", "speed"],
  ];

  return statMap.map(([name, prop]) => `${name} ${pokemon[prop]}`).join(", ");
}

function formatAbilitiesMessage(pokemon) {
  const abilities = [pokemon.ability_1, pokemon.ability_2].filter(Boolean);

  if (pokemon.ability_hidden) {
    abilities.push(`${pokemon.ability_hidden} (hidden)`);
  }

  return abilities.join(", ");
}

export function formatMessage(pokemon) {
  let message = `${pokemon.name} (№ ${pokemon.pokedex_number})`;
  message += ` ⋯ ${formatTypesMessage(pokemon)}`;
  message += ` ⋯ ${formatStatsMessage(pokemon)}`;
  message += ` ⋯ ${formatAbilitiesMessage(pokemon)}`;
  return message;
}
