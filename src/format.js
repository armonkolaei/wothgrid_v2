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

export function fmtAgo(iso) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 48) return `${hours} h ago`;
  return `${Math.round(hours / 24)} days ago`;
}
