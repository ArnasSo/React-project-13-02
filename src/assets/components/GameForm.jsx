import { useState } from "react";
import "./GameForm.css";

// Firestore imports for CREATE
import { db } from "../../firebase";
import { addDoc, collection } from "firebase/firestore";

export default function GameForm() {
  // 1) Form state = what the user has typed
  const [form, setForm] = useState({
    name: "",
    imageUrl: "",
    "Amount of Players": 2,
    "Difficulty Level": "",
    Genre: "",
    Time: 30,
    Type: "",
  });

  // 2) Extra state: show loading / disable button while saving
  const [isSaving, setIsSaving] = useState(false);

  // Helper to update one field in the form
  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  // 3) Submit handler = add to Firestore
  async function handleSubmit(e) {
    e.preventDefault();

    // Basic validation (minimum)
    if (!form.name.trim()) {
      alert("Please enter a name.");
      return;
    }

    try {
      setIsSaving(true);

      // This points to the "games" collection in Firestore
      const colRef = collection(db, "games");

      // addDoc creates a new document with the object you pass
      await addDoc(colRef, {
        ...form,

        // optional: keep things consistent
        name: form.name.trim(),
        imageUrl: form.imageUrl.trim(),
      });

      // Reset form after successful create
      setForm({
        name: "",
        imageUrl: "",
        "Amount of Players": 2,
        "Difficulty Level": "",
        Genre: "",
        Time: 30,
        Type: "",
      });
    } catch (err) {
      console.error("Error creating game:", err);
      alert("Something went wrong while saving. Check console.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form className="gameForm" onSubmit={handleSubmit}>
      <div className="gameForm__grid">
        <div className="gameForm__field">
          <label className="gameForm__label">Name</label>
          <input
            className="gameForm__input"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="e.g. Catan"
            required
          />
        </div>

        <div className="gameForm__field">
          <label className="gameForm__label">Image URL</label>
          <input
            className="gameForm__input"
            value={form.imageUrl}
            onChange={(e) => updateField("imageUrl", e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="gameForm__field">
          <label className="gameForm__label">Amount of Players</label>
          <input
            className="gameForm__input"
            type="number"
            min="1"
            value={form["Amount of Players"]}
            onChange={(e) =>
              updateField("Amount of Players", Number(e.target.value))
            }
          />
        </div>

        <div className="gameForm__field">
          <label className="gameForm__label">Time (minutes)</label>
          <input
            className="gameForm__input"
            type="number"
            min="1"
            value={form.Time}
            onChange={(e) => updateField("Time", Number(e.target.value))}
          />
        </div>

        <div className="gameForm__field">
          <label className="gameForm__label">Difficulty Level</label>
          <input
            className="gameForm__input"
            value={form["Difficulty Level"]}
            onChange={(e) => updateField("Difficulty Level", e.target.value)}
            placeholder="Easy / Medium / Hard"
          />
        </div>

        <div className="gameForm__field">
          <label className="gameForm__label">Genre</label>
          <input
            className="gameForm__input"
            value={form.Genre}
            onChange={(e) => updateField("Genre", e.target.value)}
            placeholder="Strategy, Party, Co-op..."
          />
        </div>

        <div className="gameForm__field">
          <label className="gameForm__label">Type</label>
          <input
            className="gameForm__input"
            value={form.Type}
            onChange={(e) => updateField("Type", e.target.value)}
            placeholder="Card game, Board game..."
          />
        </div>
      </div>

      <div className="gameForm__actions">
        <button className="gameForm__button" type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Add game"}
        </button>
      </div>
    </form>
  );
}