import styles from "./GamesPage.module.css";

import { useEffect, useState } from "react";

import GameForm from "./components/GameForm";
import GamesList from "./components/GamesList";

import {
  getGames,
  addGame,
  updateGame,
  deleteGame,
} from "../../services/gamesStorage";
import { getSettings } from "../../services/settingStorage";

export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [editing, setEditing] = useState(null);

  // store schema fields in state
  const [gameFields, setGameFields] = useState([]);

  // state for search input
  const [searchQuery, setSearchQuery] = useState(""); // we want initial value to be empty that's why we use ""

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
    const s = getSettings(); // s for schema
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

  const filteredGames = useMemo(() => {
    const q = searchQuery.trim().toLowerCase(); // q for "query"
    if (!q) return games;

    return games.filter((g) => {
      const title = (g.name ?? "").toString().toLowerCase(); // g for "game"
      return title.includes(q);
    });
  }, [games, searchQuery]);

  return (
    <main>
      <section className="card">
        <h1 className="h1">{editing ? "Edit game" : "Add new game"}</h1>

        <GameForm
          initialValues={editing}
          onSubmit={editing ? handleUpdate : handleCreate}
        />

        {editing && (
          <button className={styles.cancelBtn} onClick={() => setEditing(null)}>
            Cancel edit
          </button>
        )}
      </section>

      <section className="card">
        <h2 className="h1">Games</h2>

        {/* Search field */}
        <input
          className={styles.inputSearch}
          type="search"
          placeholder="Search by title…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <GamesList
          games={filteredGames}
          gameFields={gameFields}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </section>
    </main>
  );
}
