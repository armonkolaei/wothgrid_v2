// Pure portfolio maths. Every account's balance is the sum of its transactions.
//  - 'in' / 'out'  : deposits / withdrawals (change the balance, not the return)
//  - 'gain'        : signed market gain or loss (changes the balance and counts as return)

export const TYPES = {
  chequing: 'asset',
  savings: 'asset',
  cash: 'asset',
  investment: 'asset',
  crypto: 'asset',
  real_estate: 'asset',
  vehicle: 'asset',
  other_asset: 'asset',
  mortgage: 'liability',
  car_loan: 'liability',
  loan: 'liability',
  credit_card: 'liability',
  line_of_credit: 'liability',
  other_liability: 'liability',
};

export const TX_TYPES = ['in', 'out', 'gain'];

const DAY = 86400000;
const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
const iso = (d) => d.toISOString().slice(0, 10);

export const todayStr = () => iso(new Date());

export function periodStart(today) {
  const d = new Date(`${today}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() - 6);
  return iso(d);
}

const pct = (change, base) => (base === 0 ? null : round2((change / Math.abs(base)) * 100));

export function summarize({ accounts, groups, transactions }, today = todayStr()) {
  const start = periodStart(today);
  const byAccount = new Map(accounts.map((a) => [a._id, []]));
  for (const t of transactions) byAccount.get(t.accountId)?.push(t);
  for (const list of byAccount.values()) {
    list.sort((a, b) => (a.date === b.date ? String(a.createdAt) < String(b.createdAt) ? -1 : 1 : a.date < b.date ? -1 : 1));
  }
  const groupNames = new Map(groups.map((g) => [g._id, g.name]));

  const rows = accounts.map((a) => {
    const list = byAccount.get(a._id);
    let value = 0;
    let startValue = 0;
    let returnAmount = 0;
    for (const t of list) {
      value += t.amount;
      if (t.date <= start) startValue += t.amount;
      else if (t.type === 'gain') returnAmount += t.amount;
    }
    const change = value - startValue;
    return {
      id: a._id,
      name: a.name,
      type: a.type,
      kind: TYPES[a.type],
      groupId: groupNames.has(a.groupId) ? a.groupId : null,
      value: round2(value),
      change: round2(change),
      changePct: pct(change, startValue),
      returnAmount: round2(returnAmount),
      returnPct: pct(returnAmount, startValue),
      transactionCount: list.length,
    };
  });

  const sign = (kind) => (kind === 'liability' ? -1 : 1);
  const series = [];
  const state = accounts.map((a) => ({ list: byAccount.get(a._id), i: 0, sum: 0, sign: sign(TYPES[a.type]) }));
  const end = new Date(`${today}T00:00:00Z`).getTime();
  for (let ts = new Date(`${start}T00:00:00Z`).getTime(); ts <= end; ts += DAY) {
    const date = iso(new Date(ts));
    let total = 0;
    for (const s of state) {
      while (s.i < s.list.length && s.list[s.i].date <= date) s.sum += s.list[s.i++].amount;
      total += s.sign * s.sum;
    }
    series.push({ date, value: round2(total) });
  }

  const assets = round2(rows.filter((r) => r.kind === 'asset').reduce((n, r) => n + r.value, 0));
  const liabilities = round2(rows.filter((r) => r.kind === 'liability').reduce((n, r) => n + r.value, 0));
  const netWorth = round2(assets - liabilities);
  const startNet = series.length ? series[0].value : 0;

  return {
    accounts: rows,
    groups: groups.map((g) => ({ id: g._id, name: g.name })),
    totals: {
      assets,
      liabilities,
      netWorth,
      change: round2(netWorth - startNet),
      changePct: pct(netWorth - startNet, startNet),
    },
    series,
    periodStart: start,
  };
}
