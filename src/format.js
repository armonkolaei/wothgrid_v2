const money = new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' });
const compact = new Intl.NumberFormat('en-CA', { notation: 'compact', maximumFractionDigits: 1 });

export const fmtMoney = (n) => money.format(n);
export const fmtCompact = (n) => compact.format(n).toLowerCase();
export const fmtPct = (p) => (p == null ? 'N/A' : `${p.toFixed(2)}%`);

export const todayISO = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

export const fmtDate = (s) =>
  new Date(`${s}T00:00:00`).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
export const fmtShortDate = (s) =>
  new Date(`${s}T00:00:00`).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
