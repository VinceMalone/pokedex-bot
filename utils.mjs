const statNameMap = {
  hp: "HP",
  attack: "Atk",
  defense: "Def",
  "special-attack": "SpA",
  "special-defense": "SpD",
  speed: "Spe",
};

export function getStatName(name) {
  return statNameMap[name];
}

const typeSymbolMap = {
  normal: "😐",
  fire: "🔥",
  water: "💧",
  grass: "🌱",
  electric: "⚡️",
  ice: "❄️",
  fighting: "🥊",
  poison: "💀",
  ground: "⛰",
  flying: "🦅",
  psychic: "🧠",
  bug: "🐞",
  rock: "💎",
  ghost: "👻",
  dark: "🌙",
  dragon: "🐉",
  steel: "🔩",
  fairy: "🧚",
};

export function getTypeSymbol(type) {
  return typeSymbolMap[type];
}
