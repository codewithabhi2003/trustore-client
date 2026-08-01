import api from './api';

// scope is 'addresses' (customer) or 'stores' (store owner) — both routers expose the
// same /geocode?q= shape, wrapping the backend's Nominatim-backed lookup.
export const searchAddress = (query, scope = 'addresses') =>
  api.get(`/${scope}/geocode`, { params: { q: query } });
