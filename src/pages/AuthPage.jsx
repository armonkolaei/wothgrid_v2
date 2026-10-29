import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import { useAuth } from '../auth.jsx';
import { BRAND } from '../brand.js';

// Placeholders until OAuth is integrated.
const SOCIAL = ['Google', 'Apple', 'Facebook'];

export default function AuthPage({ mode }) {
  const isSignup = mode === 'signup';
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', name: '', password: '', acceptTerms: false });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await (isSignup ? signup(form) : login({ email: form.email, password: form.password }));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <Logo />
      <form className="card" onSubmit={submit}>
        <div>
          <h1>{isSignup ? 'Create Your Account' : 'Log in'}</h1>
          <p className="subtitle">
            {isSignup ? `Join ${BRAND.name}` : `Welcome back to ${BRAND.name}`}
          </p>
        </div>
        <label>
          Email Address
          <input
            type="email"
            value={form.email}
            onChange={set('email')}
            autoComplete="email"
            maxLength={200}
            required
            autoFocus
          />
        </label>
        {isSignup && (
          <label>
            Your Name
            <input value={form.name} onChange={set('name')} autoComplete="name" maxLength={100} required />
          </label>
        )}
        <label>
          {isSignup ? 'Create password' : 'Password'}
          <input
            type="password"
            value={form.password}
            onChange={set('password')}
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            minLength={isSignup ? 12 : undefined}
            maxLength={128}
            required
          />
          {isSignup && <small>Choose a 12+ character password</small>}
        </label>
        {isSignup && (
          <label className="check">
            <input type="checkbox" checked={form.acceptTerms} onChange={set('acceptTerms')} required />
            <span>
              I accept the <Link to="/terms" target="_blank">Terms of Service</Link> and{' '}
              <Link to="/privacy-policy" target="_blank">Privacy Policy</Link>.
            </span>
          </label>
        )}
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn-primary" disabled={busy}>
          {busy ? 'Please wait…' : isSignup ? 'Sign Up' : 'Log in'}
        </button>
        <p className="secure">🔒 Bank-grade security</p>

        <div className="or"><span>or</span></div>
        {SOCIAL.map((p) => (
          <button key={p} type="button" className="btn-social" disabled title="Coming soon">
            Continue with {p}
            <small>Coming soon</small>
          </button>
        ))}

        <p className="switch">
          {isSignup ? (
            <>Already have an account? <Link to="/login">Log in</Link></>
          ) : (
            <>New here? <Link to="/signup">Create an account</Link></>
          )}
        </p>
      </form>
    </div>
  );
}
