import { useState } from 'react';
import Modal from './Modal.jsx';
import { api } from '../api.js';

export default function GroupsModal({ groups, onClose, onChanged }) {
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  async function run(fn) {
    setError('');
    try {
      await fn();
      await onChanged();
    } catch (err) {
      setError(err.message);
    }
  }

  const add = (e) => {
    e.preventDefault();
    run(async () => {
      await api('/groups', { method: 'POST', body: { name } });
      setName('');
    });
  };

  const rename = (e) => {
    e.preventDefault();
    run(async () => {
      await api(`/groups/${editing.id}`, { method: 'PATCH', body: { name: editing.name } });
      setEditing(null);
    });
  };

  const remove = (g) => {
    if (!window.confirm(`Delete the group "${g.name}"? Its holdings will become uncategorized.`)) return;
    run(() => api(`/groups/${g.id}`, { method: 'DELETE', body: {} }));
  };

  return (
    <Modal title="Groups" onClose={onClose}>
      <form className="dform inline" onSubmit={add}>
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} placeholder="New group, e.g. My bank holdings" required autoFocus aria-label="Group name" />
        <button className="dbtn primary">Create</button>
      </form>
      {error && <p className="error" role="alert">{error}</p>}
      {groups.length === 0 ? (
        <p className="muted">No groups yet. Groups let you bundle holdings together and filter the table.</p>
      ) : (
        <ul className="group-list">
          {groups.map((g) => (
            <li key={g.id}>
              {editing?.id === g.id ? (
                <form className="dform inline" onSubmit={rename}>
                  <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} maxLength={100} required autoFocus aria-label="Group name" />
                  <button className="dbtn primary">Save</button>
                  <button type="button" className="dbtn ghost" onClick={() => setEditing(null)}>Cancel</button>
                </form>
              ) : (
                <>
                  <span>{g.name}</span>
                  <span className="spacer" />
                  <button className="icon-btn" onClick={() => setEditing({ id: g.id, name: g.name })} aria-label={`Rename ${g.name}`}>✎</button>
                  <button className="icon-btn" onClick={() => remove(g)} aria-label={`Delete ${g.name}`}>🗑</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
