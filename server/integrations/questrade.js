export class ProviderAuthError extends Error {}

const LOGIN_URL = process.env.QUESTRADE_LOGIN_URL || 'https://login.questrade.com/oauth2/token';
const TEST_MODE = Boolean(process.env.QUESTRADE_LOGIN_URL);
const TIMEOUT = 15000;

async function getJson(url, headers) {
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(TIMEOUT), redirect: 'error' });
  if (res.status === 400 || res.status === 401 || res.status === 403) throw new ProviderAuthError();
  if (!res.ok) throw new Error(`Questrade responded ${res.status}`);
  return res.json();
}

// Questrade refresh tokens are single-use: every exchange returns a replacement
// that must be stored, and the old one stops working.
async function authenticate(refreshToken) {
  const url = new URL(LOGIN_URL);
  url.searchParams.set('grant_type', 'refresh_token');
  url.searchParams.set('refresh_token', refreshToken);
  const data = await getJson(url);

  const server = new URL(data.api_server);
  const trusted = server.protocol === 'https:' && server.hostname.endsWith('.questrade.com');
  if (!data.access_token || !data.refresh_token || (!trusted && !TEST_MODE)) {
    throw new Error('Unexpected response from Questrade');
  }
  return {
    session: { accessToken: data.access_token, apiServer: server.origin },
    secret: data.refresh_token,
  };
}

const inferCurrency = (symbol) => (/\.(TO|V|CN|NE)$/i.test(symbol) ? 'CAD' : 'USD');
const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);

async function fetchAccounts({ accessToken, apiServer }) {
  const call = (path) => getJson(`${apiServer}/v1/${path}`, { Authorization: `Bearer ${accessToken}` });
  const { accounts = [] } = await call('accounts');

  const result = [];
  for (const a of accounts.filter((x) => !x.status || x.status === 'Active')) {
    const number = encodeURIComponent(String(a.number));
    const [balances, positionData] = await Promise.all([
      call(`accounts/${number}/balances`),
      call(`accounts/${number}/positions`),
    ]);
    // Combined balances are converted into a single currency; prefer CAD.
    const combined = balances.combinedBalances ?? balances.perCurrencyBalances ?? [];
    const row = combined.find((b) => b.currency === 'CAD') ?? combined[0] ?? {};
    result.push({
      id: String(a.number),
      name: `Questrade ${a.type ?? 'account'} ••${String(a.number).slice(-4)}`,
      type: 'investment',
      balance: num(row.totalEquity),
      cash: num(row.cash),
      positions: (positionData.positions ?? []).map((p) => ({
        symbol: String(p.symbol ?? ''),
        quantity: num(p.openQuantity),
        price: num(p.currentPrice),
        marketValue: num(p.currentMarketValue),
        avgCost: num(p.averageEntryPrice),
        openPnl: num(p.openPnl),
        currency: inferCurrency(String(p.symbol ?? '')),
      })),
    });
  }
  return result;
}

export default {
  id: 'questrade',
  name: 'Questrade',
  tag: 'CORE',
  portal: 'https://www.questrade.com',
  categories: ['brokerage'],
  credentialLabel: 'Questrade API token',
  setupLink: 'https://www.questrade.com/api',
  steps: [
    'Log in to Questrade and open the API Centre (the "API" section of your account menu).',
    'Register a personal app, and enable only the read-only permissions: account balances and positions. Do not enable trading.',
    'Generate a new token for that app and copy it.',
    'Paste the token below and click Authorize.',
  ],
  authenticate,
  fetchAccounts,
};
