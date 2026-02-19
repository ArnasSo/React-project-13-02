import GameForm from "../assets/components/GameForm";
import GamesList from "../assets/components/GamesList";

export default function GamesPage() {
    return (
        <main>
            <section className="card">
                <h1 className="h1">Add new game</h1>
                <GameForm />
            </section>
            <section className="card">
                <h2 className="h1">Games</h2>
                <GamesList />
            </section>
        </main>
    )
}