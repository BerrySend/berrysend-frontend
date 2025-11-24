import axios from 'axios';
import { getApiBaseUrl, getApiTimeout } from '@/config/environment.js';

const API_URL = getApiBaseUrl();
const API_TIMEOUT = getApiTimeout();

export const graphService = {
  getPorts: () => axios.get(`${API_URL}/api/v1/ports/`, { timeout: API_TIMEOUT }),

  getPortConnections: () => axios.get(`${API_URL}/api/v1/port-connections/`, { timeout: API_TIMEOUT }),

  getNodes: () => axios.get(`${API_URL}/api/v1/ports/`, { timeout: API_TIMEOUT }),

  getEdges: () => axios.get(`${API_URL}/api/v1/port-connections/`, { timeout: API_TIMEOUT }),

  getRoutes: () => axios.get(`${API_URL}/api/v1/port-connections/`, { timeout: API_TIMEOUT }),

  getOptimalRoute: () => axios.get(`${API_URL}/optimalRoute`, { timeout: API_TIMEOUT }),
};
