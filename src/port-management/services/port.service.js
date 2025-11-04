/**
 * Port Service
 * Handles all API operations related to ports
 *
 * @module modules/port-management/services/portService
 */

import axios from 'axios';
import Port from "@/port-management/model/port.entity.js";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

/**
 * Port Service class for API interactions
 */
class PortService {
    /**
     * Fetches all ports from the API
     *
     * @param {Object} filters - Optional filters
     * @param {string} filters.type - Filter by port type
     * @param {string} filters.country - Filter by country
     * @returns {Promise<Array<Port>>} Array of Port instances
     * @throws {Error} If API request fails
     */
    async getAllPorts(filters = {}) {
        try {
            const params = new URLSearchParams();

            if (filters.type) {
                params.append('type', filters.type);
            }

            if (filters.country) {
                params.append('country', filters.country);
            }

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
     * @param {string} portId - Port identifier
     * @returns {Promise<Port>} Port instance
     * @throws {Error} If port not found or API request fails
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
     * @param {Port} port - Port instance to create
     * @returns {Promise<Port>} Created port instance with ID
     * @throws {Error} If validation fails or API request fails
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
     * @param {string} portId - Port identifier
     * @param {Port} port - Port instance with updated data
     * @returns {Promise<Port>} Updated port instance
     * @throws {Error} If validation fails or API request fails
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
     * Deletes a port
     *
     * @param {string} portId - Port identifier
     * @returns {Promise<void>}
     * @throws {Error} If API request fails
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
     * Fetches all connections for a specific port
     *
     * @param {string} portId - Port identifier
     * @returns {Promise<Array<Object>>} Array of connection objects
     * @throws {Error} If API request fails
     */
    async getPortConnections(portId) {
        try {
            const response = await axios.get(`${API_BASE_URL}/ports/${portId}/connections`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching connections for port ${portId}:`, error);
            throw new Error(`Failed to fetch connections for port: ${portId}`);
        }
    }

    /**
     * Fetches port statistics
     *
     * @returns {Promise<Object>} Statistics object with counts
     * @throws {Error} If API request fails
     */
    async getPortStatistics() {
        try {
            const response = await axios.get(`${API_BASE_URL}/ports/statistics`);
            return response.data;
        } catch (error) {
            console.error('Error fetching port statistics:', error);
            throw new Error('Failed to fetch port statistics');
        }
    }

    /**
     * Searches ports by name or country
     *
     * @param {string} query - Search query
     * @returns {Promise<Array<Port>>} Array of matching Port instances
     * @throws {Error} If API request fails
     */
    async searchPorts(query) {
        try {
            const response = await axios.get(`${API_BASE_URL}/ports/search`, {
                params: { q: query }
            });
            return Port.fromAPIArray(response.data);
        } catch (error) {
            console.error('Error searching ports:', error);
            throw new Error('Failed to search ports');
        }
    }

    /**
     * Validates if a port name is unique
     *
     * @param {string} name - Port name to validate
     * @param {string} excludeId - Port ID to exclude from check (for updates)
     * @returns {Promise<boolean>} True if name is unique
     * @throws {Error} If API request fails
     */
    async isPortNameUnique(name, excludeId = null) {
        try {
            const response = await axios.get(`${API_BASE_URL}/ports/validate/name`, {
                params: { name, excludeId }
            });
            return response.data.isUnique;
        } catch (error) {
            console.error('Error validating port name:', error);
            throw new Error('Failed to validate port name');
        }
    }
}

// Export singleton instance
export default new PortService();