/**
 * Port Service
 * Handles all API operations related to ports (mocked via json-server)
 *
 * @module modules/port-management/services/portService
 */

import axios from 'axios';
import Port from "@/port-management/model/port.entity.js";
import { buildApiUrl, getApiTimeout } from '@/config/environment.js';

/**
 * Port Service class for API interactions
 */
class PortService {
    /**
     * Fetches all ports from the API
     *
     * Supports search filter by name
     *
     * @param {Object} options
     * @param {string} options.search - Search by port name
     * @returns {Promise<Array<Port>>}
     */
    async getAllPorts(options = {}) {
        try {
            const params = {};
            if (options.search) {
                params.search = options.search;
            }
            
            const response = await axios.get(buildApiUrl('ports'), {
                params,
                timeout: getApiTimeout()
            });
            return Port.fromAPIArray(response.data);
        } catch (error) {
            console.error('Error fetching ports:', error);
            const errorMessage = error.response?.data?.detail || 'Failed to fetch ports';
            throw new Error(errorMessage);
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
            const response = await axios.get(`${buildApiUrl('ports')}/${portId}`, {
                timeout: getApiTimeout()
            });
            return Port.fromAPI(response.data);
        } catch (error) {
            console.error(`Error fetching port ${portId}:`, error);
            if (error.response?.status === 404) {
                throw new Error('Port not found');
            }
            const errorMessage = error.response?.data?.detail || `Failed to fetch port with ID: ${portId}`;
            throw new Error(errorMessage);
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
            const response = await axios.post(
                buildApiUrl('ports'),
                port.toJSON(),
                { timeout: getApiTimeout() }
            );
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
            const response = await axios.put(
                `${buildApiUrl('ports')}/${portId}`,
                port.toJSON(),
                { timeout: getApiTimeout() }
            );
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
            await axios.delete(
                `${buildApiUrl('ports')}/${portId}`,
                { timeout: getApiTimeout() }
            );
        } catch (error) {
            console.error(`Error deleting port ${portId}:`, error);
            throw new Error(`Failed to delete port with ID: ${portId}`);
        }
    }

    /**
     * Fetches connections linked to a specific port
     *
     * @param {string} portId
     * @returns {Promise<Array<Object>>}
     */
    async getPortConnections(portId) {
        try {
            const response = await axios.get(`${buildApiUrl('ports')}/${portId}/connections`, {
                timeout: getApiTimeout()
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching connections for port ${portId}:`, error);
            if (error.response?.status === 404) {
                throw new Error('Port not found');
            }
            const errorMessage = error.response?.data?.detail || `Failed to fetch connections for port: ${portId}`;
            throw new Error(errorMessage);
        }
    }

    /**
     * Searches ports by name
     *
     * @param {string} query
     * @returns {Promise<Array<Port>>}
     */
    async searchPorts(query) {
        try {
            const response = await axios.get(buildApiUrl('ports'), {
                params: { search: query },
                timeout: getApiTimeout()
            });
            return Port.fromAPIArray(response.data);
        } catch (error) {
            console.error('Error searching ports:', error);
            const errorMessage = error.response?.data?.detail || 'Failed to search ports';
            throw new Error(errorMessage);
        }
    }
}

export default new PortService();
