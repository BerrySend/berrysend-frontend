import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const graphService = {
    getNodes: () => axios.get(`${API_URL}/nodes`),
    getEdges: () => axios.get(`${API_URL}/edges`),
    getPorts: () => axios.get(`${API_URL}/ports`),
    getRoutes: () => axios.get(`${API_URL}/routes`),
    getOptimalRoute: () => axios.get(`${API_URL}/optimalRoute`),
};