const SETTINGS_KEY = "admin_settings_v1";

/*
  Default settings (schema)

  key   = property name used in JS objects
  label = text shown in UI
  type  = input type
  defaultValue = used when creating new game
*/
const defaultSettings = {
  gameFields: [
    { key: "name", label: "Name", type: "text", defaultValue: "" },
    { key: "imageUrl", label: "Image URL", type: "text", defaultValue: "" },

    { 
      key: "players", 
      label: "Amount of Players", 
      type: "number", 
      defaultValue: 2 
    },

    { 
      key: "difficulty", 
      label: "Difficulty Level", 
      type: "text", 
      defaultValue: "" 
    },

    { key: "genre", label: "Genre", type: "text", defaultValue: "" },

    { 
      key: "time", 
      label: "Time", 
      type: "number", 
      defaultValue: 30 
    },

    { key: "type", label: "Type", type: "text", defaultValue: "" },
  ],
};

export function getSettings() {
  const raw = localStorage.getItem(SETTINGS_KEY);

  if (!raw) return defaultSettings;

  try {
    return JSON.parse(raw);
  } catch {
    return defaultSettings;
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}