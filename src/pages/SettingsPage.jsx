import { useEffect, useState } from "react";
import { getSettings, saveSettings } from "../services/settingStorage"; 
// ^ adjust path if your SettingsPage is in a different folder

export default function SettingsPage() {
  // settings is the full settings object, like { gameFields: [...] }
  const [settings, setSettings] = useState(null);

  // Controlled inputs for "Add new field" form
  const [newField, setNewField] = useState({
    key: "",
    label: "",
    type: "text",
    defaultValue: "",
  });

  // Load settings once when page opens
  useEffect(() => {
    const s = getSettings();
    setSettings(s);
  }, []);

  useEffect(() => {
  // settings is null on first render, so don't save yet
  if (!settings) return;

  // Every time settings changes, persist it
  saveSettings(settings);
}, [settings]);

  // If not loaded yet, show nothing (or a loading text)
  if (!settings) return <p>Loading settings...</p>;

  /*
    Helper: update one property inside a field in gameFields array.
    Example: change label of field index 2.
  */
  function updateField(index, prop, value) {
    setSettings((prev) => {
      const copy = structuredClone(prev); // makes a deep copy (modern browsers)
      copy.gameFields[index][prop] = value;
      return copy;
    });
  }

  /*
    Delete one field from schema.
    Note: this does NOT delete data from existing games in localStorage,
    it just removes the field from the schema (so UI won't show it).
  */
  function deleteField(index) {
    const ok = confirm("Remove this field from schema?");
    if (!ok) return;

    setSettings((prev) => {
      const copy = structuredClone(prev);
      copy.gameFields.splice(index, 1);
      return copy;
    });
  }

  /*
    Validate keys:
    - required
    - no spaces (keeps life easy)
    - unique
  */
  function isKeyValid(key) {
    if (!key.trim()) return false;
    if (key.includes(" ")) return false;

    const exists = settings.gameFields.some((f) => f.key === key);
    if (exists) return false;

    return true;
  }

  /*
    Add a new field to schema.
  */
  function addField() {
    const key = newField.key.trim();
    const label = newField.label.trim();

    if (!isKeyValid(key)) {
      alert("Key must be unique, not empty, and contain no spaces.");
      return;
    }

    if (!label) {
      alert("Label is required.");
      return;
    }

    // Convert defaultValue based on type (numbers should become Number)
    let defaultValue = newField.defaultValue;

    if (newField.type === "number") {
      // If blank, use 0 by default
      defaultValue = defaultValue === "" ? 0 : Number(defaultValue);
      if (Number.isNaN(defaultValue)) {
        alert("Default value must be a number.");
        return;
      }
    }

    setSettings((prev) => {
      const copy = structuredClone(prev);
      copy.gameFields.push({
        key,
        label,
        type: newField.type,
        defaultValue,
      });
      return copy;
    });

    // Reset add-field form
    setNewField({
      key: "",
      label: "",
      type: "text",
      defaultValue: "",
    });
  }

  return (
    <main>
      <section className="card">
        <h1 className="h1">Settings</h1>
        <p>Edit your Game schema fields here.</p>

        <h2 className="h1">Game Fields</h2>

        {/* List existing fields */}
        {settings.gameFields.map((field, index) => (
          <div key={field.key} style={{ marginBottom: 16 }}>
            {/* Key is shown, but not editable (safety) */}
            <p>
              <strong>Key:</strong> {field.key}
            </p>

            <label>Label</label>
            <input
              value={field.label}
              onChange={(e) => updateField(index, "label", e.target.value)}
            />

            <label>Type</label>
            <select
              value={field.type}
              onChange={(e) => updateField(index, "type", e.target.value)}
            >
              <option value="text">text</option>
              <option value="number">number</option>
            </select>

            <label>Default Value</label>
            <input
              // if type is number, show number input
              type={field.type}
              value={field.defaultValue ?? ""}
              onChange={(e) => {
                const raw = e.target.value;

                // Keep defaultValue consistent with type
                const value =
                  field.type === "number"
                    ? (raw === "" ? "" : Number(raw))
                    : raw;

                updateField(index, "defaultValue", value);
              }}
            />

            <button onClick={() => deleteField(index)}>Remove field</button>

            <hr />
          </div>
        ))}

        {/* Add new field */}
        <h2 className="h1">Add New Field</h2>

        <label>Key (no spaces, unique)</label>
        <input
          value={newField.key}
          onChange={(e) => setNewField((p) => ({ ...p, key: e.target.value }))}
          placeholder="example: minAge"
        />

        <label>Label (shown in UI)</label>
        <input
          value={newField.label}
          onChange={(e) => setNewField((p) => ({ ...p, label: e.target.value }))}
          placeholder="example: Minimum Age"
        />

        <label>Type</label>
        <select
          value={newField.type}
          onChange={(e) => setNewField((p) => ({ ...p, type: e.target.value }))}
        >
          <option value="text">text</option>
          <option value="number">number</option>
        </select>

        <label>Default Value</label>
        <input
          type={newField.type}
          value={newField.defaultValue}
          onChange={(e) =>
            setNewField((p) => ({ ...p, defaultValue: e.target.value }))
          }
        />

        <button onClick={addField}>Add field</button>
      </section>
    </main>
  );
}