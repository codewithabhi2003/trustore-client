import api from './api';

// POST /api/ai/extract-products -> { text } -> { success, products }
export const extractProducts = (text) => api.post('/ai/extract-products', { text });
