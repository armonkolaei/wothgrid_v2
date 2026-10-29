import { useState } from 'react';
import Modal from './Modal.jsx';
import { api } from '../api.js';
import { fmtAgo } from '../format.js';

const STATUS = {
  ok: ['Connected', 'ok'],
  pending: ['Connecting', 'warn'],
  error: ['Sync failing, retrying', 'warn'],
  needs_reauth: ['Needs a new token', 'bad'],
};

export default function ConnectionsModal({ connections, onClose, onChanged, onAdd }) {
  const [editing, setEditing] = useState(null);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function update(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await api('/connections', { method: 'POST', body: { provider: editing.provider, token } });
      setEditing(null);
      setToken('');
      await onChanged();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function disconnect(c) {
    if (!window.confirm(`Disconnect ${c.name}? Its imported accounts and holdings will be removed from Worth Grid.`)) return;
    setError('');
    try {
      await api(`/connections/${c.id}`, { method: 'DELETE', body: {} });
      await onChanged();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Modal title="Manage connections" onClose={onClose}>
      {connections.length === 0 && <p className="muted">No institutions connected.</p>}
      <ul className="group-list">
        {connections.map((c) => {
          const [label, tone] = STATUS[c.status] ?? STATUS.error;
          return (
            <li key={c.id} className="conn-row">
              <div className="conn-row-main">
                <strong>{c.name}</strong>
                <span className={`status ${tone}`}>{label}</span>
                <span className="muted">
                  {c.accounts} account{c.accounts === 1 ? '' : 's'} · {c.lastSyncAt ? `synced ${fmtAgo(c.lastSyncAt)}` : 'not synced yet'}
                </span>
                {c.lastError && c.status !== 'ok' && <span className="error">{c.lastError}</span>}
              </div>
              {editing?.id === c.id ? (
                <form className="dform inline" onSubmit={update}>
                  <input
                    type="password"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="New API token"
                    aria-label="New API token"
                    autoComplete="off"
                    maxLength={300}
                    required
                    autoFocus
                  />
                  <button className="dbtn primary" disabled={busy}>Save</button>
                  <button type="button" className="dbtn ghost" onClick={() => setEditing(null)}>Cancel</button>
                </form>
              ) : (
                <div className="conn-row-actions">
                  <button className="dbtn ghost" onClick={() => { setEditing(c); setToken(''); setError(''); }}>Update token</button>
                  <button className="dbtn danger" onClick={() => disconnect(c)}>Disconnect</button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="modal-actions">
        <button className="dbtn ghost" onClick={onAdd}>＋ Connect another</button>
        <span className="spacer" />
        <button className="dbtn primary" onClick={onClose}>Done</button>
      </div>
    </Modal>
  );
}
