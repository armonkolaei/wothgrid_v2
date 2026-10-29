import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo.jsx';
import { NAV } from '../content/nav.js';

function Chevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function Menu({ item }) {
  return (
    <ul className="dropdown-menu">
      {item.items.map((i) =>
        i.heading ? (
          <li key={i.heading} className="menu-heading">{i.heading}</li>
        ) : (
          <li key={i.to}>
            <Link to={i.to}>
              <strong>{i.title}</strong>
              <span>{i.text}</span>
            </Link>
          </li>
        ),
      )}
    </ul>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(null);
  const [mobile, setMobile] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(null);
    setMobile(false);
  }, [pathname]);

  return (
    <header className="navbar">
      <Logo />
      <button
        className="hamburger"
        aria-label="Toggle menu"
        aria-expanded={mobile}
        onClick={() => setMobile((m) => !m)}
      >
        ☰
      </button>
      <div className={`nav-panel${mobile ? ' open' : ''}`}>
        <nav className="nav-links" aria-label="Main">
          {NAV.map((m) =>
            m.items ? (
              <div
                className={`dropdown${open === m.label ? ' open' : ''}`}
                key={m.label}
                onMouseEnter={() => setOpen(m.label)}
                onMouseLeave={() => setOpen(null)}
              >
                <button
                  type="button"
                  className="nav-link"
                  aria-haspopup="true"
                  aria-expanded={open === m.label}
                  onClick={() => setOpen(open === m.label ? null : m.label)}
                >
                  {m.label} <Chevron />
                </button>
                <Menu item={m} />
              </div>
            ) : (
              <Link key={m.label} className="nav-link" to={m.to}>{m.label}</Link>
            ),
          )}
        </nav>
        <div className="nav-actions">
          <span className="locale" aria-label="Region">🌐 US - EN</span>
          <Link to="/login" className="login-link">Log in</Link>
          <Link to="/signup" className="btn-primary small">Get Started</Link>
        </div>
      </div>
    </header>
  );
}
