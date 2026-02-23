import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getGames } from "../../services/gamesStorage";
import { useLocation } from "react-router-dom";

export default function HomePage() {
  // null = loading state (optional but nice UX)
  const [totalGames, setTotalGames] = useState(null);
  const location = useLocation();

  useEffect(() => {
  /*
    This runs whenever the route changes.
    So when user navigates back to "/"
    → totalGames recalculates
  */
  const games = getGames();
  setTotalGames(games.length);

}, [location.pathname]); //

  return (
    <main>
      <section className="card">
        <h1 className="h1">Admin Dashboard</h1>
        <p>Welcome. Use the shortcuts below to manage your content.</p>
      </section>

      <section className="card">
        <h2 className="h1">Quick Links</h2>

        <div style={{ display: "grid", gap: 12 }}>
          <Link to="/games">Manage Games</Link>
          <Link to="/users">Users (coming soon)</Link>
          <Link to="/settings">Settings</Link> {/* nice addition */}
        </div>
      </section>

      <section className="card">
        <h2 className="h1">Overview</h2>
        <div style={{ display: "grid", gap: 12 }}>
        <Link to="/">Search Games</Link>
        <p>
          Total Games:{" "}
          {totalGames === null ? "Loading..." : totalGames}
        </p>
        </div>
      </section>
    </main>
  );
}