import axios from 'axios';

// Usar la variable de entorno o un valor por defecto
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const graphService = {
  getPorts: () => axios.get(`${API_URL}/api/v1/ports/`),

  getPortConnections: () => axios.get(`${API_URL}/api/v1/port-connections/`),

  getNodes: () => axios.get(`${API_URL}/api/v1/ports/`),
  getEdges: () => axios.get(`${API_URL}/api/v1/port-connections/`),
  getRoutes: () => axios.get(`${API_URL}/api/v1/port-connections/`),

  getOptimalRoute: () => axios.get(`${API_URL}/optimalRoute`),
};
