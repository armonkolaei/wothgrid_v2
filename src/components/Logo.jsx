import { Link } from 'react-router-dom';
import { BRAND } from '../brand.js';

export default function Logo() {
  return (
    <Link to="/" className="logo" aria-label={`${BRAND.name} home`}>
      <img src="/logo.png" width="34" height="34" alt="" />
      <span>{BRAND.name}</span>
    </Link>
  );
}
