import { useEffect, useState } from 'react';
import Modal from './Modal.jsx';
import { api } from '../api.js';
import { BRAND } from '../brand.js';

const SKIP_KEY = 'wg.skipConnectNotice';
const readSkip = () => {
  try {
    return localStorage.getItem(SKIP_KEY) === '1';
  } catch {
    return false;
  }
};

export function ProviderLogo({ provider, size = 40 }) {
  const style = { width: size, height: size, fontSize: size * 0.5 };
  if (provider.id === 'questrade') {
    return <span className="p-logo q" style={style} aria-hidden="true">Q</span>;
  }
  return <span className="p-logo" style={style} aria-hidden="true">{provider.name[0]}</span>;
}

function Header() {
  return (
    <div className="conn-head">
      <span className="conn-icon" aria-hidden="true">🏛️</span>
      <div>
        <strong>Banks & Brokerages</strong>
        <p>Connect your institution to bring in your balances and holdings.</p>
      </div>
      <span className="conn-badge" title="Tokens are encrypted before they are stored">🔒 Read-only access<br />Encrypted at rest</span>
    </div>
  );
}

export default function ConnectModal({ onClose, onBack, onConnected }) {
  const [providers, setProviders] = useState(null);
  const [step, setStep] = useState('pick');
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const [dontShow, setDontShow] = useState(false);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api('/institutions').then(setProviders).catch((e) => setError(e.message));
  }, []);

  const provider = providers?.find((p) => p.id === selected);
  const shown = (providers ?? []).filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()));

  function next() {
    if (step === 'pick') setStep(readSkip() ? 'authorize' : 'notice');
    else if (step === 'notice') {
      if (dontShow) {
        try {
          localStorage.setItem(SKIP_KEY, '1');
        } catch {
          // Preference is optional.
        }
      }
      setStep('authorize');
    }
  }

  function back() {
    setError('');
    if (step === 'authorize') setStep(readSkip() ? 'pick' : 'notice');
    else if (step === 'notice') setStep('pick');
    else onBack();
  }

  async function authorize(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const conn = await api('/connections', { method: 'POST', body: { provider: provider.id, token } });
      setToken('');
      await onConnected(conn);
      onClose();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <Modal title="Banks & Brokerages" onClose={onClose} wide hideTitle>
      {step === 'pick' && (
        <div className="conn">
          <Header />
          <h3>Connect your institution to bring in your holdings and balances</h3>
          <input
            className="conn-search"
            placeholder="Search for your institution"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search institutions"
            autoFocus
          />
          <p className="conn-tabs"><span className="on">Banks & Brokerages</span><span>More institutions coming soon</span></p>
          {!providers && !error && <p className="muted">Loading…</p>}
          <div className="prov-grid">
            {shown.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`prov${selected === p.id ? ' on' : ''}`}
                onClick={() => setSelected(p.id)}
                aria-pressed={selected === p.id}
              >
                <ProviderLogo provider={p} size={44} />
                <span>{p.name}</span>
                <em>{p.tag}</em>
              </button>
            ))}
            {providers && shown.length === 0 && <p className="muted">No match. More institutions are on the way.</p>}
          </div>
          {error && <p className="error" role="alert">{error}</p>}
          <div className="modal-actions">
            <span className="spacer" />
            <button className="dbtn ghost" onClick={back}>Back</button>
            <button className="dbtn primary" disabled={!selected} onClick={next}>Next</button>
          </div>
        </div>
      )}

      {step === 'notice' && (
        <div className="conn">
          <span className="notice-tag">Notice</span>
          <h3>How {BRAND.name} connects to your institution</h3>
          <p>
            {BRAND.name} connects to {provider.name} with a <strong>read-only API token</strong> that you create
            yourself in your {provider.name} account. We never see your {provider.name} password, and the token cannot
            place trades or move money.
          </p>
          <p><strong>Your token is stored encrypted</strong> and used only to read your balances and holdings. You can
            revoke it at any time from {provider.name}, or disconnect here, which also deletes the imported accounts.</p>
          <p>
            Connections can occasionally fail or need a new token, for example when a token expires. When that happens
            we will tell you, and you can keep tracking that account manually in the meantime.
          </p>
          <p>Your balances refresh automatically every 24 hours, and any time you press Sync.</p>
          <label className="check">
            <input type="checkbox" checked={dontShow} onChange={(e) => setDontShow(e.target.checked)} />
            <span>Do not show this message again</span>
          </label>
          <div className="modal-actions">
            <span className="spacer" />
            <button className="dbtn ghost" onClick={back}>Back</button>
            <button className="dbtn primary" onClick={next}>Next</button>
          </div>
        </div>
      )}

      {step === 'authorize' && provider && (
        <form className="conn" onSubmit={authorize}>
          <Header />
          <h4>Institution</h4>
          <p className="inst-line">
            <ProviderLogo provider={provider} size={26} /> <strong>{provider.name}</strong> <em className="tag">{provider.tag}</em>
          </p>
          <p className="muted">
            Institution portal:{' '}
            <a href={provider.portal} target="_blank" rel="noopener noreferrer">{provider.portal}</a>
          </p>
          <h4>Credentials</h4>
          <p className="muted">
            {BRAND.name} reads your data through a read-only API token that you generate at {provider.name}. Follow
            these steps, then paste the token below.
          </p>
          <ol className="steps">
            {provider.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <p>
            <a href={provider.setupLink} target="_blank" rel="noopener noreferrer">Open {provider.name} API documentation ↗</a>
          </p>
          <label>
            {provider.credentialLabel}
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              maxLength={300}
              required
              autoFocus
            />
          </label>
          {error && <p className="error" role="alert">{error}</p>}
          <div className="modal-actions">
            <span className="trust">
              <span className="p-logo crown" aria-hidden="true">♛</span> ⇄ <ProviderLogo provider={provider} size={30} />
            </span>
            <span className="spacer" />
            <button type="button" className="dbtn ghost" onClick={back}>Back</button>
            <button className="dbtn primary" disabled={busy || token.trim().length < 10}>
              {busy ? 'Connecting…' : 'Authorize'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
