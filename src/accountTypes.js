export const ACCOUNT_TYPES = {
  chequing: { label: 'Chequing', kind: 'asset', icon: '🏦' },
  savings: { label: 'Savings', kind: 'asset', icon: '💰' },
  cash: { label: 'Cash', kind: 'asset', icon: '💵' },
  investment: { label: 'Investment', kind: 'asset', icon: '📈' },
  crypto: { label: 'Crypto', kind: 'asset', icon: '🪙' },
  real_estate: { label: 'Real estate', kind: 'asset', icon: '🏠' },
  vehicle: { label: 'Vehicle', kind: 'asset', icon: '🚗' },
  other_asset: { label: 'Other asset', kind: 'asset', icon: '💎' },
  mortgage: { label: 'Mortgage', kind: 'liability', icon: '🏡' },
  car_loan: { label: 'Car loan', kind: 'liability', icon: '🚙' },
  loan: { label: 'Loan', kind: 'liability', icon: '🧾' },
  credit_card: { label: 'Credit card', kind: 'liability', icon: '💳' },
  line_of_credit: { label: 'Line of credit', kind: 'liability', icon: '🪪' },
  other_liability: { label: 'Other liability', kind: 'liability', icon: '📉' },
};

export const typesOfKind = (kind) =>
  Object.entries(ACCOUNT_TYPES).filter(([, t]) => t.kind === kind);

export const TX_LABELS = {
  asset: { in: 'Deposit', out: 'Withdrawal', gain: 'Market gain / loss' },
  liability: { in: 'Borrowed / charged', out: 'Payment', gain: 'Interest / adjustment' },
};
