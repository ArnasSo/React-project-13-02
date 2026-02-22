import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <p className="footer__text">
          © {new Date().getFullYear()} SpilCafe Admin
        </p>
      </div>
    </footer>
  );
}