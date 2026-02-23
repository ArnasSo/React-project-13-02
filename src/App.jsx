import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import GamesPage from "./pages/Games/GamesPage";
import Users from "./pages/Users/Users";
import SettingsPage from "./pages/Settings/SettingsPage";

import OneStateExample from "./pages/StatesExamples/OneStateExample";
import TwoStateExample from "./pages/StatesExamples/TwoStateExample";

import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

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
      {/* <OneStateExample />  */}
      {/* <TwoStateExample /> */}

      <Footer />
    </>
  );
}