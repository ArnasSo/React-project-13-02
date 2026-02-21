# 🎲 Spilcafe Admin Panel

A simple admin interface for managing board games.

This project was built as a learning-focused React + Vite application.  
It supports CRUD operations (Create, Read, Update, Delete) and includes a dynamic schema system that allows game fields to be customized without rewriting UI components.

---

## ✨ Features

- ✅ Add new games  
- ✅ Edit existing games  
- ✅ Delete games  
- ✅ Data persistence via **localStorage**  
- ✅ Dynamic **Settings / Schema editor**  
- ✅ Form auto-updates based on schema  
- ✅ List auto-updates based on schema  

---

## 🧱 Tech Stack

- React
- Vite
- React Router
- localStorage (client-side storage)

> Firebase configuration is still present in the project but not currently used.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS recommended)
- npm (comes with Node)

### Install dependencies
```bash
npm install
```
### Run dev server
```bash
npm run dev
```

## 🧭 Routes

- / → Home / Dashboard

- /games → Games CRUD interface

- /users → Placeholder page

- /settings → Schema / Settings editor

## 💾 Data Storage (localStorage)
All data is stored directly in the browser using localStorage:

- admin_games_v1 → stores game records
- admin_settings_v1 → stores schema/settings
No backend is required to run the application.

