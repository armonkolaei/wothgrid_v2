import questrade from './questrade.js';

// To support another institution, add a module exporting the same shape
// (id, name, tag, portal, steps, authenticate, fetchAccounts) and register it here.
export const PROVIDERS = { [questrade.id]: questrade };

export const listProviders = () =>
  Object.values(PROVIDERS).map(({ id, name, tag, portal, categories, credentialLabel, setupLink, steps }) => ({
    id, name, tag, portal, categories, credentialLabel, setupLink, steps,
  }));
