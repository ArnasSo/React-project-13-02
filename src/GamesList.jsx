import { useEffect, useState } from "react";
import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export default function GamesList() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchGames() {
    try {
      const snap = await getDocs(collection(db, "games"));
      const data = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGames(data);
    } catch (err) {
      console.error("Error fetching games:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGames();
  }, []);

  if (loading) return <p>Loading games...</p>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Games</h2>

      {games.length === 0 ? (
        <p>No games found.</p>
      ) : (
        <ul>
          {games.map(game => (
            <li key={game.id}>
              <strong>{game.name}</strong>
              {game.genre && <> — {game.genre}</>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}