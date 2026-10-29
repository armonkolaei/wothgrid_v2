import { useCallback, useEffect, useMemo, useState } from 'react';
import AppShell from '../components/AppShell.jsx';
import NetWorthChart from '../components/NetWorthChart.jsx';
import AccountModal from '../components/AccountModal.jsx';
import GroupsModal from '../components/GroupsModal.jsx';
import { api } from '../api.js';
import { ACCOUNT_TYPES } from '../accountTypes.js';
import { fmtMoney, fmtPct } from '../format.js';

const tone = (n, liability) => (n === 0 ? '' : (n > 0) !== liability ? 'pos' : 'neg');
const arrow = (n) => (n > 0 ? '↑' : n < 0 ? '↓' : '');

function Delta({ amount, pct, liability }) {
  const cls = tone(amount, liability);
  return (
    <>
      <td className={`amt ${cls}`}>{fmtMoney(amount)}</td>
      <td className={`amt ${pct == null ? 'na' : cls}`}>
        {fmtPct(pct)} {pct != null && <small>{arrow(pct)}</small>}
      </td>
    </>
  );
}

function Section({ title, rows, total, groupNames, onOpen, liability }) {
  return (
    <section className="holdings">
      <div className="holdings-head">
        <h2>{title}</h2>
        <strong>{fmtMoney(total)}</strong>
      </div>
      <div className="table-scroll">
        <table className="holdings-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Groups</th>
              <th className="amt">Value</th>
              <th className="amt" colSpan="2">6 month change</th>
              <th className="amt" colSpan="2">6 month return</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan="7" className="empty">Nothing here yet.</td>
              </tr>
            )}
            {rows.map((r) => (
              <tr key={r.id} tabIndex={0} onClick={() => onOpen(r.id)} onKeyDown={(e) => e.key === 'Enter' && onOpen(r.id)}>
                <td>
                  <div className="name-cell">
                    <span className="type-icon" aria-hidden="true">{ACCOUNT_TYPES[r.type].icon}</span>
                    <span>
                      {r.name}
                      <small>{ACCOUNT_TYPES[r.type].label}</small>
                    </span>
                  </div>
                </td>
                <td>
                  {r.groupId ? <span className="chip">{groupNames.get(r.groupId)}</span> : <span className="dot" title="Uncategorized" />}
                </td>
                <td className="amt strong">{fmtMoney(r.value)}</td>
                <Delta amount={r.change} pct={r.changePct} liability={liability} />
                <Delta amount={r.returnAmount} pct={r.returnPct} liability={liability} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const safeCell = (v) => {
  const s = String(v ?? '');
  return `"${(/^[=+\-@\t\r]/.test(s) ? `'${s}` : s).replace(/"/g, '""')}"`;
};

function exportCsv(data, groupNames) {
  const head = ['Name', 'Type', 'Kind', 'Group', 'Value', '6M change', '6M change %', '6M return', '6M return %'];
  const lines = data.accounts.map((r) =>
    [
      r.name,
      ACCOUNT_TYPES[r.type].label,
      r.kind,
      r.groupId ? groupNames.get(r.groupId) : '',
      r.value,
      r.change,
      r.changePct ?? '',
      r.returnAmount,
      r.returnPct ?? '',
    ].map(safeCell).join(','),
  );
  const blob = new Blob([[head.map(safeCell).join(','), ...lines].join('\r\n')], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'worth-grid-holdings.csv';
  a.click();
  URL.revokeObjectURL(a.href);
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [showGroups, setShowGroups] = useState(false);

  const reload = useCallback(async () => {
    try {
      setData(await api('/portfolio'));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }, []);
  useEffect(() => {
    reload();
  }, [reload]);

  const groupNames = useMemo(() => new Map((data?.groups ?? []).map((g) => [g.id, g.name])), [data]);

  // A deleted group can leave the filter pointing at nothing.
  const activeFilter = filter === 'all' || filter === 'none' || groupNames.has(filter) ? filter : 'all';
  const visible = (data?.accounts ?? []).filter(
    (a) => activeFilter === 'all' || (activeFilter === 'none' ? !a.groupId : a.groupId === activeFilter),
  );
  const byValue = (list) => [...list].sort((a, b) => b.value - a.value);
  const assets = byValue(visible.filter((a) => a.kind === 'asset'));
  const liabilities = byValue(visible.filter((a) => a.kind === 'liability'));
  const sum = (list) => list.reduce((n, a) => n + a.value, 0);
  const account = selected && selected !== 'new' ? data?.accounts.find((a) => a.id === selected) : null;

  return (
    <AppShell onAdd={() => data && setSelected('new')}>
      <main className="dash">
        {error && <p className="error" role="alert">{error}</p>}
        {!data && !error && <p className="muted">Loading…</p>}
        {data && (
          <>
            <div className="summary">
              <div className="stat main">
                <span>Net worth</span>
                <strong className={data.totals.netWorth < 0 ? 'neg' : ''}>{fmtMoney(data.totals.netWorth)}</strong>
                <small className={tone(data.totals.change, false)}>
                  {fmtMoney(data.totals.change)} ({fmtPct(data.totals.changePct)}) {arrow(data.totals.change)} in 6 months
                </small>
              </div>
              <div className="stat">
                <span>Total assets</span>
                <strong>{fmtMoney(data.totals.assets)}</strong>
              </div>
              <div className="stat">
                <span>Total liabilities</span>
                <strong>{fmtMoney(data.totals.liabilities)}</strong>
              </div>
            </div>

            <div className="chart-card">
              {data.accounts.length === 0 && (
                <div className="chart-empty">
                  <p>Add your first holding to start tracking your net worth.</p>
                  <button className="dbtn primary" onClick={() => setSelected('new')}>Add a holding</button>
                </div>
              )}
              <NetWorthChart series={data.series} />
            </div>

            <div className="toolbar">
              <div className="chips">
                <button className={`pill${activeFilter === 'all' ? ' on' : ''}`} onClick={() => setFilter('all')}>All</button>
                {data.groups.map((g) => (
                  <button key={g.id} className={`pill${activeFilter === g.id ? ' on' : ''}`} onClick={() => setFilter(g.id)}>
                    {g.name}
                  </button>
                ))}
                {data.groups.length > 0 && (
                  <button className={`pill${activeFilter === 'none' ? ' on' : ''}`} onClick={() => setFilter('none')}>
                    Uncategorized
                  </button>
                )}
                <button className="pill ghost" onClick={() => setShowGroups(true)}>＋ Groups</button>
              </div>
              <div className="toolbar-actions">
                <button className="dbtn primary" disabled title="Automatic syncing is coming soon">⟳ Sync</button>
                <button className="dbtn primary" onClick={() => exportCsv(data, groupNames)}>Export CSV</button>
                <button className="dbtn primary" onClick={() => setSelected('new')}>＋ Add holding</button>
              </div>
            </div>

            <Section title="Assets" rows={assets} total={sum(assets)} groupNames={groupNames} onOpen={setSelected} />
            <Section title="Liabilities" rows={liabilities} total={sum(liabilities)} groupNames={groupNames} onOpen={setSelected} liability />
          </>
        )}
      </main>

      {selected === 'new' && (
        <AccountModal groups={data.groups} onClose={() => setSelected(null)} onChanged={reload} />
      )}
      {account && (
        <AccountModal key={account.id} account={account} groups={data.groups} onClose={() => setSelected(null)} onChanged={reload} />
      )}
      {showGroups && <GroupsModal groups={data.groups} onClose={() => setShowGroups(false)} onChanged={reload} />}
    </AppShell>
  );
}
