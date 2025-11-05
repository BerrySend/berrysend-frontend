/**
 * Port Service
 * Handles all API operations related to ports (mocked via json-server)
 *
 * @module modules/port-management/services/portService
 */

import axios from 'axios';
import Port from "@/port-management/model/port.entity.js";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Port Service class for API interactions
 */
class PortService {
    /**
     * Fetches all ports from the mock API
     *
     * Supports type or country filters
     *
     * @param {Object} filters
     * @param {string} filters.type
     * @param {string} filters.country
     * @returns {Promise<Array<Port>>}
     */
    async getAllPorts(filters = {}) {
        try {
            const params = new URLSearchParams(filters);
            const response = await axios.get(`${API_BASE_URL}/ports`, { params });
            return Port.fromAPIArray(response.data);
        } catch (error) {
            console.error('Error fetching ports:', error);
            throw new Error('Failed to fetch ports');
        }
    }

    /**
     * Fetches a single port by ID
     *
     * @param {string} portId
     * @returns {Promise<Port>}
     */
    async getPortById(portId) {
        try {
            const response = await axios.get(`${API_BASE_URL}/ports/${portId}`);
            return Port.fromAPI(response.data);
        } catch (error) {
            console.error(`Error fetching port ${portId}:`, error);
            throw new Error(`Failed to fetch port with ID: ${portId}`);
        }
    }

    /**
     * Creates a new port
     *
     * @param {Port} port
     * @returns {Promise<Port>}
     */
    async createPort(port) {
        const validation = port.validate();

        if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/ports`, port.toJSON());
            return Port.fromAPI(response.data);
        } catch (error) {
            console.error('Error creating port:', error);
            throw new Error('Failed to create port');
        }
    }

    /**
     * Updates an existing port
     *
     * @param {string} portId
     * @param {Port} port
     * @returns {Promise<Port>}
     */
    async updatePort(portId, port) {
        const validation = port.validate();

        if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }

        try {
            const response = await axios.put(`${API_BASE_URL}/ports/${portId}`, port.toJSON());
            return Port.fromAPI(response.data);
        } catch (error) {
            console.error(`Error updating port ${portId}:`, error);
            throw new Error(`Failed to update port with ID: ${portId}`);
        }
    }

    /**
     * Deletes a port by ID
     *
     * @param {string} portId
     * @returns {Promise<void>}
     */
    async deletePort(portId) {
        try {
            await axios.delete(`${API_BASE_URL}/ports/${portId}`);
        } catch (error) {
            console.error(`Error deleting port ${portId}:`, error);
            throw new Error(`Failed to delete port with ID: ${portId}`);
        }
    }

    /**
     * Fetches edges (connections) linked to a specific port
     *
     * @param {string} portId
     * @returns {Promise<Array<Object>>}
     */
    async getPortConnections(portId) {
        try {
            const response = await axios.get(`${API_BASE_URL}/edges`, {
                params: {
                    source: portId,
                    target: portId
                }
            });

            const directConnections = response.data.filter(
                edge => edge.source === portId || edge.target === portId
            );

            return directConnections;
        } catch (error) {
            console.error(`Error fetching connections for port ${portId}:`, error);
            throw new Error(`Failed to fetch connections for port: ${portId}`);
        }
    }

    /**
     * Searches ports by name or type (json-server supports q= for full-text)
     *
     * @param {string} query
     * @returns {Promise<Array<Port>>}
     */
    async searchPorts(query) {
        try {
            const response = await axios.get(`${API_BASE_URL}/ports`, {
                params: { q: query }
            });
            return Port.fromAPIArray(response.data);
        } catch (error) {
            console.error('Error searching ports:', error);
            throw new Error('Failed to search ports');
        }
    }
}

export default new PortService();
