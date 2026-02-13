import { useEffect, useState } from "react";
import { db } from "../../firebase";

// Firestore functions we need:
// - onSnapshot: real-time read
// - deleteDoc: delete
// - updateDoc: update
// - doc: reference a specific document
// - collection: reference a collection
import {
  collection,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

import "./GamesList.css";

export default function GamesList() {
  const [games, setGames] = useState([]);

  // Which game are we editing right now?
  // null means "not editing anything"
  const [editingId, setEditingId] = useState(null);

  // Local edit form state (separate from Firestore)
  // This holds what the user types while editing
  const [editForm, setEditForm] = useState({
    name: "",
    imageUrl: "",
    "Amount of Players": 2,
    "Difficulty Level": "",
    Genre: "",
    Time: 30,
    Type: "",
  });

  useEffect(() => {
    const colRef = collection(db, "games");

    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setGames(data);
    });

    return () => unsubscribe();
  }, []);

  async function handleDelete(gameId, gameName) {
    const ok = confirm(`Delete "${gameName}"?`);
    if (!ok) return;

    await deleteDoc(doc(db, "games", gameId));
  }

  // When user clicks "Edit"
  function startEdit(game) {
    setEditingId(game.id);

    // Fill editForm with the current game values
    // so the inputs show existing data
    setEditForm({
      name: game.name ?? "",
      imageUrl: game.imageUrl ?? "",
      "Amount of Players": game["Amount of Players"] ?? 2,
      "Difficulty Level": game["Difficulty Level"] ?? "",
      Genre: game.Genre ?? "",
      Time: game.Time ?? 30,
      Type: game.Type ?? "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
  }

  // Helper to update one field in the edit form
  function updateEditField(key, value) {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  }

  // Save changes to Firestore
  async function saveEdit(gameId) {
    if (!editForm.name.trim()) {
      alert("Name is required.");
      return;
    }

    // Only update the fields we care about
    await updateDoc(doc(db, "games", gameId), {
      ...editForm,
      name: editForm.name.trim(),
      imageUrl: editForm.imageUrl.trim(),
    });

    // Exit edit mode
    setEditingId(null);
  }

  return (
    <div className="games">
      {games.length === 0 ? (
        <p className="games__empty">No games found.</p>
      ) : (
        <div className="games__grid">
          {games.map((game) => {
            const isEditing = editingId === game.id;

            return (
              <article className="gameCard" key={game.id}>
                {/* IMAGE (view mode) */}
                {!isEditing ? (
                  game.imageUrl ? (
                    <img
                      className="gameCard__img"
                      src={game.imageUrl}
                      alt={game.name}
                    />
                  ) : (
                    <div className="gameCard__imgPlaceholder">No image</div>
                  )
                ) : (
                  // IMAGE URL input (edit mode)
                  <div className="gameCard__imgEdit">
                    <label className="gameCard__label">Image URL</label>
                    <input
                      className="gameCard__input"
                      value={editForm.imageUrl}
                      onChange={(e) => updateEditField("imageUrl", e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                )}

                <div className="gameCard__body">
                  {/* VIEW MODE */}
                  {!isEditing ? (
                    <>
                      <h3 className="gameCard__title">{game.name}</h3>

                      <p className="gameCard__meta">
                        <strong>Players:</strong> {game["Amount of Players"] ?? "-"}
                      </p>
                      <p className="gameCard__meta">
                        <strong>Time:</strong> {game.Time ?? "-"} min
                      </p>
                      <p className="gameCard__meta">
                        <strong>Difficulty:</strong>{" "}
                        {game["Difficulty Level"] ?? "-"}
                      </p>
                      <p className="gameCard__meta">
                        <strong>Genre:</strong> {game.Genre ?? "-"}
                      </p>
                      <p className="gameCard__meta">
                        <strong>Type:</strong> {game.Type ?? "-"}
                      </p>

                      <div className="gameCard__actions">
                        <button
                          className="gameCard__button"
                          onClick={() => startEdit(game)}
                        >
                          Edit
                        </button>

                        <button
                          className="gameCard__danger"
                          onClick={() => handleDelete(game.id, game.name)}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  ) : (
                    /* EDIT MODE */
                    <>
                      <div className="gameCard__editGrid">
                        <div className="gameCard__field">
                          <label className="gameCard__label">Name</label>
                          <input
                            className="gameCard__input"
                            value={editForm.name}
                            onChange={(e) => updateEditField("name", e.target.value)}
                          />
                        </div>

                        <div className="gameCard__field">
                          <label className="gameCard__label">Players</label>
                          <input
                            className="gameCard__input"
                            type="number"
                            min="1"
                            value={editForm["Amount of Players"]}
                            onChange={(e) =>
                              updateEditField("Amount of Players", Number(e.target.value))
                            }
                          />
                        </div>

                        <div className="gameCard__field">
                          <label className="gameCard__label">Time (min)</label>
                          <input
                            className="gameCard__input"
                            type="number"
                            min="1"
                            value={editForm.Time}
                            onChange={(e) => updateEditField("Time", Number(e.target.value))}
                          />
                        </div>

                        <div className="gameCard__field">
                          <label className="gameCard__label">Difficulty</label>
                          <input
                            className="gameCard__input"
                            value={editForm["Difficulty Level"]}
                            onChange={(e) =>
                              updateEditField("Difficulty Level", e.target.value)
                            }
                          />
                        </div>

                        <div className="gameCard__field">
                          <label className="gameCard__label">Genre</label>
                          <input
                            className="gameCard__input"
                            value={editForm.Genre}
                            onChange={(e) => updateEditField("Genre", e.target.value)}
                          />
                        </div>

                        <div className="gameCard__field">
                          <label className="gameCard__label">Type</label>
                          <input
                            className="gameCard__input"
                            value={editForm.Type}
                            onChange={(e) => updateEditField("Type", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="gameCard__actions">
                        <button
                          className="gameCard__button"
                          onClick={() => saveEdit(game.id)}
                        >
                          Save
                        </button>

                        <button className="gameCard__button" onClick={cancelEdit}>
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}