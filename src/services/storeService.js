import api from './api';

export const getNearbyStores = (lat, lng, radius = 5) =>
  api.get('/stores/nearby', { params: { lat, lng, radius } });

export const getStoreById = (id) => api.get(`/stores/${id}`);

export const getStoreProducts = (id) => api.get(`/stores/${id}/products`);

export const registerStore = (formData) =>
  api.post('/stores/register', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const toggleStoreOpen = () => api.patch('/stores/my-store/toggle-open');