import { useCallback, useEffect, useState } from 'react';
import Modal from './Modal.jsx';
import { api } from '../api.js';
import { ACCOUNT_TYPES, TX_LABELS, typesOfKind } from '../accountTypes.js';
import { fmtAgo, fmtDate, fmtMoney, todayISO } from '../format.js';

function TypeSelect({ value, onChange, kind, disabled }) {
  const groups = kind ? [[kind, typesOfKind(kind)]] : [['asset', typesOfKind('asset')], ['liability', typesOfKind('liability')]];
  return (
    <select value={value} onChange={onChange} disabled={disabled}>
      {groups.map(([k, list]) => (
        <optgroup key={k} label={k === 'asset' ? 'Assets' : 'Liabilities'}>
          {list.map(([key, t]) => (
            <option key={key} value={key}>{t.label}</option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}

function Transactions({ account, onChanged }) {
  const labels = TX_LABELS[account.kind];
  const blank = { type: 'in', amount: '', date: todayISO(), note: '' };
  const [list, setList] = useState(null);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const base = `/accounts/${account.id}/transactions`;

  const load = useCallback(
    () => api(base).then(setList).catch((e) => setError(e.message)),
    [base],
  );
  useEffect(() => {
    load();
  }, [load]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setError('');
    let { type, amount } = form;
    amount = Number(amount);
    if (!Number.isFinite(amount)) return setError('Enter an amount');
    if (type === 'set') {
      const delta = Math.round((amount - account.value) * 100) / 100;
      if (delta === 0) return setError('That is already the current balance');
      type = delta > 0 ? 'in' : 'out';
      amount = Math.abs(delta);
    } else if (type !== 'gain' && amount <= 0) {
      return setError('Enter an amount greater than zero');
    }
    setBusy(true);
    try {
      const body = { type, amount, date: form.date, note: form.note };
      if (editing) await api(`${base}/${editing}`, { method: 'PATCH', body });
      else await api(base, { method: 'POST', body });
      setForm(blank);
      setEditing(null);
      await Promise.all([load(), onChanged()]);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(t) {
    if (!window.confirm('Delete this transaction?')) return;
    setError('');
    try {
      await api(`${base}/${t.id}`, { method: 'DELETE', body: {} });
      if (editing === t.id) {
        setEditing(null);
        setForm(blank);
      }
      await Promise.all([load(), onChanged()]);
    } catch (err) {
      setError(err.message);
    }
  }

  function edit(t) {
    setEditing(t.id);
    setForm({ type: t.type, amount: String(t.type === 'gain' ? t.amount : Math.abs(t.amount)), date: t.date, note: t.note });
  }

  return (
    <section className="tx">
      <h3>Transactions</h3>
      <form className="tx-form" onSubmit={submit}>
        <select value={form.type} onChange={set('type')} aria-label="Transaction type">
          <option value="in">{labels.in}</option>
          <option value="out">{labels.out}</option>
          <option value="gain">{labels.gain} (+/−)</option>
          {!editing && <option value="set">Set balance to…</option>}
        </select>
        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          value={form.amount}
          onChange={set('amount')}
          aria-label="Amount"
          required
        />
        <input type="date" value={form.date} onChange={set('date')} aria-label="Date" required />
        <input placeholder="Note (optional)" value={form.note} onChange={set('note')} maxLength={200} aria-label="Note" />
        <button className="dbtn primary" disabled={busy}>{editing ? 'Save' : 'Add'}</button>
        {editing && (
          <button type="button" className="dbtn ghost" onClick={() => { setEditing(null); setForm(blank); }}>
            Cancel
          </button>
        )}
      </form>
      {error && <p className="error" role="alert">{error}</p>}
      {list === null ? (
        <p className="muted">Loading…</p>
      ) : list.length === 0 ? (
        <p className="muted">No transactions yet. Add one to start tracking this balance.</p>
      ) : (
        <div className="tx-scroll">
          <table className="tx-table">
            <tbody>
              {list.map((t) => (
                <tr key={t.id}>
                  <td className="nowrap">{fmtDate(t.date)}</td>
                  <td>{labels[t.type]}</td>
                  <td className="muted">{t.note}</td>
                  <td className={`amt ${t.amount < 0 ? 'neg' : 'pos'}`}>{fmtMoney(t.amount)}</td>
                  <td className="tx-actions">
                    <button type="button" className="icon-btn" onClick={() => edit(t)} aria-label="Edit transaction">✎</button>
                    <button type="button" className="icon-btn" onClick={() => remove(t)} aria-label="Delete transaction">🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

function Positions({ account }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    api(`/accounts/${account.id}/positions`).then(setData).catch((e) => setError(e.message));
  }, [account.id, account.value]);

  return (
    <section className="tx">
      <h3>Holdings</h3>
      {error && <p className="error" role="alert">{error}</p>}
      {!data && !error && <p className="muted">Loading…</p>}
      {data && (
        <>
          <p className="muted">
            Cash: <strong>{fmtMoney(data.cash)}</strong>
            {data.syncedAt && ` · updated ${fmtAgo(data.syncedAt)}`}
          </p>
          {data.positions.length === 0 ? (
            <p className="muted">No open positions.</p>
          ) : (
            <div className="tx-scroll">
              <table className="tx-table pos-table">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th className="amt">Qty</th>
                    <th className="amt">Price</th>
                    <th className="amt">Market value</th>
                    <th className="amt">Open P&amp;L</th>
                  </tr>
                </thead>
                <tbody>
                  {data.positions.map((p) => (
                    <tr key={p.symbol}>
                      <td>{p.symbol} <small className="muted">{p.currency}</small></td>
                      <td className="amt">{p.quantity}</td>
                      <td className="amt">{fmtMoney(p.price)}</td>
                      <td className="amt">{fmtMoney(p.marketValue)}</td>
                      <td className={`amt ${p.openPnl < 0 ? 'neg' : p.openPnl > 0 ? 'pos' : ''}`}>{fmtMoney(p.openPnl)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="muted small-note">
            The account value above is converted to CAD by your institution. Position amounts are shown in their trading currency.
          </p>
        </>
      )}
    </section>
  );
}

export default function AccountModal({ account, groups, defaultType, title, onClose, onChanged }) {
  const isNew = !account;
  const [form, setForm] = useState({
    name: account?.name ?? '',
    type: account?.type ?? defaultType ?? 'chequing',
    groupId: account?.groupId ?? '',
    openingBalance: '',
    openingDate: todayISO(),
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const kind = ACCOUNT_TYPES[form.type].kind;

  async function submit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const body = { name: form.name, type: form.type, groupId: form.groupId || null };
      if (isNew) {
        if (form.openingBalance !== '') {
          body.openingBalance = Number(form.openingBalance);
          body.openingDate = form.openingDate;
        }
        await api('/accounts', { method: 'POST', body });
        await onChanged();
        onClose();
      } else {
        await api(`/accounts/${account.id}`, { method: 'PATCH', body });
        await onChanged();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm(`Delete "${account.name}" and all of its transactions? This cannot be undone.`)) return;
    try {
      await api(`/accounts/${account.id}`, { method: 'DELETE', body: {} });
      await onChanged();
      onClose();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Modal title={isNew ? title ?? 'Add a holding' : account.name} onClose={onClose} wide={!isNew}>
      <form className="dform" onSubmit={submit}>
        <label>
          Name
          <input value={form.name} onChange={set('name')} maxLength={100} required autoFocus placeholder="e.g. Personal Chequing" />
        </label>
        <div className="row2">
          <label>
            Type
            <TypeSelect value={form.type} onChange={set('type')} kind={isNew ? null : account.kind} disabled={account?.synced} />
          </label>
          <label>
            Group
            <select value={form.groupId} onChange={set('groupId')}>
              <option value="">Uncategorized</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </label>
        </div>
        {isNew && (
          <div className="row2">
            <label>
              {kind === 'liability' ? 'Amount owed (optional)' : 'Current value (optional)'}
              <input type="number" step="0.01" min="0" value={form.openingBalance} onChange={set('openingBalance')} placeholder="0.00" />
            </label>
            <label>
              As of
              <input type="date" value={form.openingDate} onChange={set('openingDate')} />
            </label>
          </div>
        )}
        {error && <p className="error" role="alert">{error}</p>}
        <div className="modal-actions">
          {!isNew && !account.synced && (
            <button type="button" className="dbtn danger" onClick={remove}>Delete</button>
          )}
          {account?.synced && <span className="muted small-note">Synced account. Disconnect the institution to remove it.</span>}
          <span className="spacer" />
          <button type="button" className="dbtn ghost" onClick={onClose}>{isNew ? 'Cancel' : 'Close'}</button>
          <button className="dbtn primary" disabled={busy}>{isNew ? 'Add' : 'Save changes'}</button>
        </div>
      </form>
      {!isNew && (account.synced ? <Positions account={account} /> : <Transactions account={account} onChanged={onChanged} />)}
    </Modal>
  );
}
