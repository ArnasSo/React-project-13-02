import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

// Firestore
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function HomePage() {
    const [totalGames, setTotalGames] = useState(null); //null means still "loading"

    useEffect(() => {
        // Listening to games collection in db real-time
        const colRef = collection(db, "games");

        // onSnapshot automatically updates when data changes - real time change
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            setTotalGames(snapshot.size);
        });

        // cleanup and stopping listening when page unmounts
        return () => unsubscribe();
    }, []);

    return (
        <main>
            <section className="card">
                <h1 className="h1">Admin Dashboard</h1>
                <p>Welcome. Use the shortcuts below to manage your content.</p>
            </section>

            <section className="card">
                <h2 className="h1">Quick Links</h2>

                {/* Navigation Cards */}
                <div style={{ display: "grid", gap: 12}} >
                    <Link to="/games">Manage Games</Link>
                    <Link to="/users">Users (coming soon)</Link>
                </div>
            </section>

            <section className="card">
                <h2 className="h1">Overview</h2>
                <p>Total Games: {totalGames === null ? "Loading..." : totalGames}</p>
            </section>
        </main>
    )
}