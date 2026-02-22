import { useEffect, useState } from "react";

import GameForm from "./components/GameForm";
import GamesList from "./components/GamesList";

import { getGames, addGame, updateGame, deleteGame } from "../../services/gamesStorage";
import { getSettings } from "../../services/settingStorage";

export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [editing, setEditing] = useState(null);

  // store schema fields in state
  const [gameFields, setGameFields] = useState([]);

  function refreshGames() {
    setGames(getGames());
  }

  // Load games once
  useEffect(() => {
    refreshGames();
  }, []);

  // Load schema once + keep it updated if you want
  useEffect(() => {
    // Load current schema fields
    const s = getSettings();
    setGameFields(s.gameFields);

    // OPTIONAL: if you want GamesPage to react when schema changes in another tab
    // window.addEventListener("storage", ...) could be used later.
  }, []);


  function handleCreate(gameData) {
    addGame(gameData);
    refreshGames();
  }

  function handleUpdate(gameData) {
    updateGame(editing.id, gameData);
    setEditing(null);
    refreshGames();
  }

  function handleDelete(id) {
    deleteGame(id);
    if (editing?.id === id) setEditing(null);
    refreshGames();
  }

  function handleEdit(game) {
    setEditing(game);
  }

  return (
    <main>
      <section className="card">
        <h1 className="h1">{editing ? "Edit game" : "Add new game"}</h1>

        <GameForm
          initialValues={editing}
          onSubmit={editing ? handleUpdate : handleCreate}
        />

        {editing && (
          <button onClick={() => setEditing(null)}>Cancel edit</button>
        )}
      </section>

      <section className="card">
        <h2 className="h1">Games</h2>

        {/* pass schema fields into list */}
        <GamesList
          games={games}
          gameFields={gameFields}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </section>
    </main>
  );
}