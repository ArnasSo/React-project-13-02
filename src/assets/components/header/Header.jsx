import { NavLink } from "react-router-dom";
import "./Header.css";

export default function Header (){
    return (
        <header className="header">
            <div className="header__inner">
                <div className="header__brand">
                    <span className="header__logo" aria-hidden="true">🎲</span>
                    <span className="header__title">Spilcafe Admin</span>
                </div>

                <nav className="header__nav" aria-label="Primary">
                    <NavLink to="/" className="header__link">Home</NavLink>
                    <NavLink to="/games" className="header__link">Games</NavLink>
                    <NavLink to="/users" className="header__link">Users</NavLink>
                    <NavLink to="/settings" className="header__link">Settings</NavLink>
                </nav>
            </div>
        </header>
    );
}