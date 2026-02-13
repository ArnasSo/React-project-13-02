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
                    <a href="#" className="header__link">Games</a>
                </nav>
            </div>
        </header>
    );
}