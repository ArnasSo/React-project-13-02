import "./GamesList.css";

/*
  Props:
  - games: array of game objects
  - gameFields: schema array from settingsStorage (controls what to show)
  - onEdit(game)
  - onDelete(id)
*/
export default function GamesList({ games, gameFields = [], onEdit, onDelete }) {
  const safeGames = games ?? [];

  function handleDeleteClick(game) {
    const ok = confirm(`Delete "${game.name}"?`);
    if (!ok) return;
    onDelete(game.id);
  }

  return (
    <div className="games">
      {safeGames.length === 0 ? (
        <p className="games__empty">No games found.</p>
      ) : (
        <div className="games__grid">
          {safeGames.map((game) => (
            <article className="gameCard" key={game.id}>
              {game.imageUrl ? (
                <img
                  className="gameCard__img"
                  src={game.imageUrl}
                  alt={game.name || "Game image"}
                />
              ) : (
                <div className="gameCard__imgPlaceholder">No image</div>
              )}

              <div className="gameCard__body">
                {/* Use schema label for "name" if you want,
                    but keeping title as game.name is fine */}
                <h3 className="gameCard__title">{game.name || "(no name)"}</h3>

                {/* Show fields based on schema */}
                {gameFields
                  // Optional: don't show imageUrl as text since we already show the image
                  .filter((f) => f.key !== "imageUrl" && f.key !== "name")
                  .map((f) => (
                    <p className="gameCard__meta" key={f.key}>
                      <strong>{f.label}:</strong>{" "}
                      {/* If game doesn't have that key yet (new schema), show "-" */}
                      {game[f.key] ?? "-"}
                      {/* Optional: add "min" label only for time */}
                      {f.key === "time" && game[f.key] != null ? " min" : ""}
                    </p>
                  ))}

                <div className="gameCard__actions">
                  <button className="gameCard__button" onClick={() => onEdit(game)}>
                    Edit
                  </button>

                  <button
                    className="gameCard__danger"
                    onClick={() => handleDeleteClick(game)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}