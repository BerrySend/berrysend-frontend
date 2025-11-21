import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

/**
 * Export Service
 * Handles all API operations related to exports management
 */
class ExportService {
    /**
     * Fetch all exports
     *
     * @returns {Promise<Array>} Array of export records
     * @throws {Error} If API request fails
     */
    async getAllExports() {
        try {
            const response = await axios.get(`${API_BASE_URL}/exports`);
            return response.data;
        } catch (error) {
            console.error('Error fetching exports:', error);
            throw new Error('Failed to fetch exports');
        }
    }

    /**
     * Get export by ID
     *
     * @param {string} exportId - Export identifier
     * @returns {Promise<Object>} Export record
     * @throws {Error} If export not found or API request fails
     */
    async getExportById(exportId) {
        try {
            const response = await axios.get(`${API_BASE_URL}/exports/${exportId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching export ${exportId}:`, error);
            throw new Error('Export not found');
        }
    }

    /**
     * Get optimal route for an export
     *
     * @param {string} exportId - Export identifier
     * @returns {Promise<Object>} Optimal route information
     * @throws {Error} If API request fails
     */
    async getExportRoute(exportId) {
        try {
            const response = await axios.get(`${API_BASE_URL}/exports/${exportId}/route`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching route for export ${exportId}:`, error);
            throw new Error('Failed to fetch export route');
        }
    }

    /**
     * Get route details by ID
     *
     * @param {string} routeId - Route identifier
     * @returns {Promise<Object>} Route details
     * @throws {Error} If API request fails
     */
    async getRouteById(routeId) {
        try {
            const response = await axios.get(`${API_BASE_URL}/routes/${routeId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching route ${routeId}:`, error);
            throw new Error('Route not found');
        }
    }

    /**
     * Create a new export with a route
     *
     * @param {Object} exportData - Export data
     * @param {string} exportData.route_id - Route identifier (required)
     * @returns {Promise<Object>} Created export with ID
     * @throws {Error} If validation fails or API request fails
     */
    async createExport(exportData) {
        try {
            const response = await axios.post(`${API_BASE_URL}/exports`, exportData);
            return response.data;
        } catch (error) {
            console.error('Error creating export:', error);
            throw new Error('Failed to create export');
        }
    }

    /**
     * Create export from optimized route result
     * Associates the computed route with a new export record
     *
     * @param {string} routeId - Route identifier from optimization result
     * @param {string} originPortName - Origin port name
     * @param {string} destinationPortName - Destination port name
     * @returns {Promise<Object>} Created export with ID
     * @throws {Error} If API request fails
     */
    async createExportFromRoute(routeId, originPortName, destinationPortName) {
        try {
            const exportData = {
                route_id: routeId,
                origin_port_name: originPortName,
                destination_port_name: destinationPortName
            };

            const response = await axios.post(`${API_BASE_URL}/exports`, exportData);
            return response.data;
        } catch (error) {
            console.error('Error creating export from route:', error);
            throw new Error('Failed to create export from route');
        }
    }

    /**
     * Change the route associated with an export
     * Simply update the route_id to swap routes
     *
     * @param {string} exportId - Export identifier
     * @param {string} routeId - New route identifier
     * @returns {Promise<Object>} Updated export with new route
     * @throws {Error} If API request fails
     */
    async changeExportRoute(exportId, routeId) {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/exports/${exportId}`,
                { route_id: routeId }
            );
            return response.data;
        } catch (error) {
            console.error(`Error changing route for export ${exportId}:`, error);
            throw new Error('Failed to change export route');
        }
    }

    /**
     * Update an existing export
     *
     * @param {string} exportId - Export identifier
     * @param {Object} updateData - Data to update
     * @returns {Promise<Object>} Updated export
     * @throws {Error} If API request fails
     */
    async updateExport(exportId, updateData) {
        try {
            const response = await axios.put(`${API_BASE_URL}/exports/${exportId}`, updateData);
            return response.data;
        } catch (error) {
            console.error(`Error updating export ${exportId}:`, error);
            throw new Error('Failed to update export');
        }
    }

    /**
     * Delete an export
     *
     * @param {string} exportId - Export identifier
     * @returns {Promise<void>}
     * @throws {Error} If API request fails
     */
    async deleteExport(exportId) {
        try {
            await axios.delete(`${API_BASE_URL}/exports/${exportId}`);
        } catch (error) {
            console.error(`Error deleting export ${exportId}:`, error);
            throw new Error('Failed to delete export');
        }
    }
}

export default new ExportService();

