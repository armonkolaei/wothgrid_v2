import { Link } from 'react-router-dom';
import { BRAND } from '../brand.js';

// Placeholder crown mark; replace with the final logo.
export default function Logo() {
  return (
    <Link to="/" className="logo" aria-label={`${BRAND.name} home`}>
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
        <circle cx="15" cy="15" r="15" fill="#6d28d9" />
        <path d="M7 20l-1-8 5 4 4-7 4 7 5-4-1 8z" fill="#fff" />
      </svg>
      <span>{BRAND.name}</span>
    </Link>
  );
}
