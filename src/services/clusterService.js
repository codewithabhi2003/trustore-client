import api from './api';

// POST /api/clusters/find -> { lat, lng, products[] } -> { bestCluster, allClusters, borderStores }
export const findBestCluster = (lat, lng, products) =>
  api.post('/clusters/find', { lat, lng, products });
