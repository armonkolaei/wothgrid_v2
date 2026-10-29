import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { BRAND } from '../brand.js';

const TABS = ['Holdings', 'Budget', 'Transactions', 'Help'];

const Crown = () => (
  <svg width="26" height="26" viewBox="0 0 30 30" aria-hidden="true">
    <circle cx="15" cy="15" r="15" fill="#9d5ce6" />
    <path d="M7 20l-1-8 5 4 4-7 4 7 5-4-1 8z" fill="#fff" />
  </svg>
);

const Gauge = () => (
  <svg width="30" height="26" viewBox="0 0 32 28" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
    <path d="M5 21a11 11 0 1 1 22 0" />
    <path d="M16 20l5-7" />
    <path d="M3 26h26" />
  </svg>
);

export default function AppShell({ onAdd, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const close = (e) => menuRef.current && !menuRef.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="app">
      <header className="app-bar">
        <button className="app-pill" type="button">
          <Crown />
          <span>{BRAND.name}</span>
          <span className="app-360">360°</span>
          <span aria-hidden="true">⌄</span>
        </button>
        <nav className="app-tabs" aria-label="Main">
          <Link to="/dashboard" className="app-tab active" aria-label="Dashboard"><Gauge /></Link>
          {TABS.map((t) => (
            <button key={t} type="button" className="app-tab">{t}</button>
          ))}
        </nav>
        <div className="app-right">
          <button type="button" className="app-cta" onClick={onAdd}>＋ Add</button>
          <button type="button" className="app-cta">⚡ Power-Ups</button>
          <div className="app-user" ref={menuRef}>
            <button
              type="button"
              className="avatar"
              onClick={() => setOpen((o) => !o)}
              aria-haspopup="menu"
              aria-expanded={open}
              aria-label="Account menu"
            >
              <svg viewBox="0 0 40 40" aria-hidden="true">
                <rect width="40" height="40" fill="#d1d5db" />
                <circle cx="20" cy="16" r="7" fill="#fff" />
                <path d="M6 40c0-9 6-14 14-14s14 5 14 14z" fill="#fff" />
              </svg>
            </button>
            {open && (
              <div className="app-menu" role="menu">
                <div className="app-menu-head">
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </div>
                <button
                  type="button"
                  role="menuitem"
                  onClick={async () => {
                    await logout();
                    navigate('/', { replace: true });
                  }}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      {children}
      <footer className="app-footer">
        <span>© {new Date().getFullYear()} {BRAND.name}</span>
        <Link to="/terms">Terms of Service</Link>
        <Link to="/privacy-policy">Privacy Policy</Link>
      </footer>
    </div>
  );
}
