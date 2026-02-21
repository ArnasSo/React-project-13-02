import "./SettingsPage.css";

import { useEffect, useState } from "react";
import { getSettings, saveSettings } from "../services/settingStorage";
// ^ adjust path if your SettingsPage is in a different folder

export default function SettingsPage() {
    // settings is the full settings object, like { gameFields: [...] }
    const [settings, setSettings] = useState(null);
    const [savedSettings, setSavedSettings] = useState(null);
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
        setSavedSettings(structuredClone(s)); // keep a snapshot of what is saved
    }, []);

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

    function isFieldDirty(index) {
        // compare current field vs saved field
        const current = settings.gameFields[index];
        const saved = savedSettings?.gameFields[index];

        // if we don't have savedSettings yet, treat as not dirty
        if (!saved) return false;

        return (
            current.label !== saved.label ||
            current.type !== saved.type ||
            current.defaultValue !== saved.defaultValue
        );
    }

    function saveField(index) {
        // Save the WHOLE settings object (localStorage can’t partially save one field)
        // but the UI button is per-field, which is what you want UX-wise.
        saveSettings(settings);

        // Update "saved snapshot" so the green button disappears
        setSavedSettings(structuredClone(settings));
    }

    return (
        <main>
            {/* Card 1: Current fields */}
            <section className="card settings">
                <h1 className="h1">Settings</h1>
                <p className="settings__hint">
                    Edit your Game schema fields here. Changes are saved automatically.
                </p>

                <h2 className="h1">Current Fields</h2>

                <div className="settings__list">
                    {settings.gameFields.map((field, index) => (
                        <article className="settingsField" key={field.key}>
                            <div className="settingsField__top">
                                <p className="settingsField__key">
                                    <strong>Key:</strong> {field.key}
                                </p>

                                <div className="settingsField__topActions">
                                    {isFieldDirty(index) && (
                                        <button
                                            className="settings__success"
                                            onClick={() => saveField(index)}
                                            type="button"
                                        >
                                            Save
                                        </button>
                                    )}

                                    <button
                                        className="settings__danger"
                                        onClick={() => deleteField(index)}
                                        type="button"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                            <div className="settingsField__grid">
                                <div className="settingsField__item">
                                    <label className="settings__label">Label</label>
                                    <input
                                        className="settings__input"
                                        value={field.label}
                                        onChange={(e) => updateField(index, "label", e.target.value)}
                                    />
                                </div>

                                <div className="settingsField__item">
                                    <label className="settings__label">Type</label>
                                    <select
                                        className="settings__input"
                                        value={field.type}
                                        onChange={(e) => updateField(index, "type", e.target.value)}
                                    >
                                        <option value="text">text</option>
                                        <option value="number">number</option>
                                    </select>
                                </div>

                                <div className="settingsField__item">
                                    <label className="settings__label">Default Value</label>
                                    <input
                                        className="settings__input"
                                        type={field.type}
                                        value={field.defaultValue ?? ""}
                                        onChange={(e) => {
                                            const raw = e.target.value;
                                            const value =
                                                field.type === "number"
                                                    ? (raw === "" ? "" : Number(raw))
                                                    : raw;
                                            updateField(index, "defaultValue", value);
                                        }}
                                    />
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* Card 2: Add new field */}
            <section className="card settings">
                <h2 className="h1">Add New Field</h2>

                <div className="settingsAdd">
                    <div className="settingsAdd__grid">
                        <div className="settingsAdd__item">
                            <label className="settings__label">Key (no spaces, unique)</label>
                            <input
                                className="settings__input"
                                value={newField.key}
                                onChange={(e) => setNewField((p) => ({ ...p, key: e.target.value }))}
                                placeholder="example: minAge"
                            />
                        </div>

                        <div className="settingsAdd__item">
                            <label className="settings__label">Label (shown in UI)</label>
                            <input
                                className="settings__input"
                                value={newField.label}
                                onChange={(e) => setNewField((p) => ({ ...p, label: e.target.value }))}
                                placeholder="example: Minimum Age"
                            />
                        </div>

                        <div className="settingsAdd__item">
                            <label className="settings__label">Type</label>
                            <select
                                className="settings__input"
                                value={newField.type}
                                onChange={(e) => setNewField((p) => ({ ...p, type: e.target.value }))}
                            >
                                <option value="text">text</option>
                                <option value="number">number</option>
                            </select>
                        </div>

                        <div className="settingsAdd__item">
                            <label className="settings__label">Default Value</label>
                            <input
                                className="settings__input"
                                type={newField.type}
                                value={newField.defaultValue}
                                onChange={(e) =>
                                    setNewField((p) => ({ ...p, defaultValue: e.target.value }))
                                }
                            />
                        </div>
                    </div>

                    <div className="settings__actions">
                        <button className="settings__button" onClick={addField} type="button">
                            Add field
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}