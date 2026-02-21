// This is the "drawer name" in localStorage where games are stored.
// Everything saved under this key will be a JSON string.
const GAMES_KEY = "admin_games_v1";

/*
  Read ALL games from localStorage.

  Returns:
  - An array of game objects
  - If storage empty or broken JSON -> []
*/
export function getGames() {
  const raw = localStorage.getItem(GAMES_KEY);

  // If nothing has been saved yet, localStorage returns null
  if (!raw) return [];

  try {
    // Convert JSON string -> JS array
    return JSON.parse(raw);
  } catch (e) {
    // If the JSON got corrupted somehow, we fail safely
    console.warn("Games JSON invalid. Returning empty list.", e);
    return [];
  }
}

/*
  Save the FULL games array back to localStorage.

  Note:
  - localStorage only stores strings
  - JSON.stringify converts array/object -> string
*/
function saveGames(games) {
  localStorage.setItem(GAMES_KEY, JSON.stringify(games));
}

/*
  CREATE:
  Add one new game.

  newGameData is just the fields from your form, for example:
  { name:"Catan", players:4, time:60, ... }
*/
export function addGame(newGameData) {
  const games = getGames();

  const newGame = {
    id: crypto.randomUUID(), // unique ID for edit/delete and React keys
    createdAt: Date.now(),   // optional, but useful
    ...newGameData,          // copy all fields from the form into this object
  };

  // Put the new game first (so it appears at the top)
  const updated = [newGame, ...games];

  saveGames(updated);

  // Return the created object (sometimes useful)
  return newGame;
}

/*
  UPDATE:
  Update a game by id.

  updates is the new form data:
  { name:"New name", players:2, ... }
*/
export function updateGame(id, updates) {
  const games = getGames();

  const updated = games.map((g) => {
    if (g.id !== id) return g;

    // Merge:
    // - keep old fields
    // - overwrite with new ones
    return { ...g, ...updates };
  });

  saveGames(updated);
}

/*
  DELETE:
  Remove a game by id.
*/
export function deleteGame(id) {
  const games = getGames();
  const updated = games.filter((g) => g.id !== id);
  saveGames(updated);
}