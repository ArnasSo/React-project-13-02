import {Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GamesPage from "./pages/GamesPage";
import Users from "./pages/Users";

import Header from "./assets/components/header/Header";
import Footer from "./assets/components/footer/Footer";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/users" element={<Users />} />

        <Route path="/settings" element={<SettingsPage />} />

        {/* optional to redirect to home if there is an unknown path */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />
    </>
  );
}