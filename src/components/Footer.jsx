import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import { FOOTER } from '../content/nav.js';
import { BRAND } from '../brand.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <Logo />
          <p>Simplify your financial life.</p>
          <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
        </div>
        {FOOTER.map((col) => (
          <div key={col.heading}>
            <h4>{col.heading}</h4>
            <ul>
              {col.links.map(([label, to]) => (
                <li key={label}><Link to={to}>{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="copyright">© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
    </footer>
  );
}
