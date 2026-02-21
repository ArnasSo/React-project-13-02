import { useEffect, useState } from "react";
import { getSettings } from "../../services/settingStorage";
import "./GameForm.css"; // ✅ your nice CSS

export default function GameForm({ initialValues = null, onSubmit }) {
  const [settings, setSettings] = useState(null);
  const [form, setForm] = useState({});

  function buildEmptyForm(fields) {
    const obj = {};
    fields.forEach((f) => {
      obj[f.key] = f.defaultValue;
    });
    return obj;
  }

  function pickSchemaFields(fields, sourceObj) {
    const cleanObj = {};
    fields.forEach((f) => {
      cleanObj[f.key] = sourceObj?.[f.key] ?? f.defaultValue;
    });
    return cleanObj;
  }

  useEffect(() => {
    const s = getSettings();
    setSettings(s);

    if (initialValues) {
      setForm(pickSchemaFields(s.gameFields, initialValues));
    } else {
      setForm(buildEmptyForm(s.gameFields));
    }
  }, []);

  useEffect(() => {
    if (!settings) return;

    if (initialValues) {
      setForm(pickSchemaFields(settings.gameFields, initialValues));
    } else {
      setForm(buildEmptyForm(settings.gameFields));
    }
  }, [initialValues, settings]);

  if (!settings) return null;

  function handleChange(fieldKey, rawValue, type) {
    const value =
      type === "number" ? (rawValue === "" ? "" : Number(rawValue)) : rawValue;

    setForm((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!onSubmit) return;
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="gameForm__grid">
        {settings.gameFields.map((f) => (
          <div className="gameForm__field" key={f.key}>
            <label className="gameForm__label">{f.label}</label>

            <input
              className="gameForm__input"
              type={f.type}
              value={form[f.key] ?? ""}
              onChange={(e) => handleChange(f.key, e.target.value, f.type)}
            />
          </div>
        ))}
      </div>

      <div className="gameForm__actions">
        <button className="gameForm__button" type="submit">
          Save
        </button>
      </div>
    </form>
  );
}