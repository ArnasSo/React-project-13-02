import { useEffect, useState } from "react";

// IMPORTANT: make sure the filename matches your real file name.
// If your file is settingsStorage.js -> import { getSettings } from "../../services/settingsStorage";
import { getSettings } from "../../services/settingStorage";

/*
  GameForm Props:

  initialValues:
  - null => we are creating a new game
  - object => we are editing an existing game (includes id, createdAt, etc.)

  onSubmit:
  - function passed from GamesPage
  - we call it with the form data when user clicks Save
*/
export default function GameForm({ initialValues = null, onSubmit }) {
  const [settings, setSettings] = useState(null);

  // "form" is our current input values object
  const [form, setForm] = useState({});

  /*
    Build an empty form object using schema defaults.

    Example output:
    {
      name: "",
      imageUrl: "",
      players: 2,
      time: 30,
      ...
    }
  */
  function buildEmptyForm(fields) {
    const obj = {};
    fields.forEach((f) => {
      obj[f.key] = f.defaultValue;
    });
    return obj;
  }

  /*
    OPTIONAL (but recommended):
    When saving, only submit schema fields.
    This prevents accidentally saving id/createdAt/anything extra inside game objects.
  */
  function pickSchemaFields(fields, sourceObj) {
    const cleanObj = {};
    fields.forEach((f) => {
      cleanObj[f.key] = sourceObj?.[f.key] ?? f.defaultValue;
    });
    return cleanObj;
  }

  // Load settings once on mount
  useEffect(() => {
    const s = getSettings();
    setSettings(s);

    // Initial form values depend on create vs edit mode
    if (initialValues) {
      // Editing: start from the values of the selected game
      setForm(pickSchemaFields(s.gameFields, initialValues));
    } else {
      // Creating: start from schema defaults
      setForm(buildEmptyForm(s.gameFields));
    }
  }, []); // run once

  // If initialValues changes (click Edit on another game), update the form
  useEffect(() => {
    if (!settings) return;

    if (initialValues) {
      setForm(pickSchemaFields(settings.gameFields, initialValues));
    } else {
      setForm(buildEmptyForm(settings.gameFields));
    }
  }, [initialValues, settings]);

  // Don't render before settings are loaded
  if (!settings) return null;

  function handleChange(fieldKey, rawValue, type) {
    // Convert number inputs from string to number
    const value =
      type === "number" ? (rawValue === "" ? "" : Number(rawValue)) : rawValue;

    setForm((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    // If onSubmit wasn't passed, do nothing (prevents crash)
    if (!onSubmit) return;

    // Send the form data back to parent (GamesPage)
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit}>
      {settings.gameFields.map((f) => (
        <div key={f.key}>
          <label>{f.label}</label>

          <input
            type={f.type}
            value={form[f.key] ?? ""}
            onChange={(e) => handleChange(f.key, e.target.value, f.type)}
          />
        </div>
      ))}

      <button type="submit">Save</button>
    </form>
  );
}