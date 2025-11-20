import axios from 'axios';

// Usar la variable de entorno o un valor por defecto
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const graphService = {
  // ✅ NUEVO: Obtener todos los puertos
  getPorts: () => axios.get(`${API_URL}/api/v1/ports/`),

  // ✅ NUEVO: Obtener las conexiones entre puertos (rutas)
  getPortConnections: () => axios.get(`${API_URL}/api/v1/port-connections/`),

  // ✅ COMPATIBILIDAD: Mantener nombres antiguos para no romper código
  getNodes: () => axios.get(`${API_URL}/api/v1/ports/`),
  getEdges: () => axios.get(`${API_URL}/api/v1/port-connections/`),
  getRoutes: () => axios.get(`${API_URL}/api/v1/port-connections/`),

  // ✅ NOTA: getOptimalRoute probablemente vendrá del backend también
  // Por ahora se mantiene como fallback al JSON local
  getOptimalRoute: () => axios.get(`${API_URL}/optimalRoute`),
};