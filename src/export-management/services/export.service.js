import axios from 'axios';
import { buildApiUrl, getApiTimeout } from '@/config/environment.js';

/**
 * Export Service
 * Handles all API operations related to exports management
 */
class ExportService {
    /**
     * Fetch all exports
     * Requires authentication
     *
     * @returns {Promise<Array>} Array of export records
     * @throws {Error} If API request fails or unauthorized
     */
    async getAllExports() {
        try {
            const response = await axios.get(buildApiUrl('exports'), {
                timeout: getApiTimeout()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching exports:', error);
            if (error.response?.status === 401) {
                throw new Error('Authentication required');
            }
            const errorMessage = error.response?.data?.detail || 'Failed to fetch exports';
            throw new Error(errorMessage);
        }
    }

    /**
     * Get export by ID
     * Requires authentication
     *
     * @param {string} exportId - Export identifier (UUID)
     * @returns {Promise<Object>} Export record
     * @throws {Error} If export not found or API request fails
     */
    async getExportById(exportId) {
        try {
            const response = await axios.get(`${buildApiUrl('exports')}/${exportId}`, {
                timeout: getApiTimeout()
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching export ${exportId}:`, error);
            if (error.response?.status === 401) {
                throw new Error('Authentication required');
            }
            if (error.response?.status === 404) {
                throw new Error('Export not found');
            }
            const errorMessage = error.response?.data?.detail || 'Failed to fetch export';
            throw new Error(errorMessage);
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
            const response = await axios.get(`${buildApiUrl('exports')}/${exportId}/route`, {
                timeout: getApiTimeout()
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching route for export ${exportId}:`, error);
            throw new Error('Failed to fetch export route');
        }
    }

    /**
     * Get route details by ID
     *
     * @param {string} routeId - Route identifier (UUID)
     * @returns {Promise<Object>} Route details
     * @throws {Error} If API request fails
     */
    async getRouteById(routeId) {
        try {
            const response = await axios.get(`${buildApiUrl('routes')}/${routeId}`, {
                timeout: getApiTimeout()
            });
            // Backend returns: { optimized_route_id, visited_ports, total_distance, total_time, total_cost, algorithm_used, route_mode }
            return response.data;
        } catch (error) {
            console.error(`Error fetching route ${routeId}:`, error);
            if (error.response?.status === 404) {
                throw new Error('Route not found');
            }
            const errorMessage = error.response?.data?.detail || 'Failed to fetch route';
            throw new Error(errorMessage);
        }
    }

    /**
     * Create a new export with a route
     * Requires authentication (JWT token)
     *
     * @param {Object} exportData - Export data
     * @param {string} exportData.comercial_description - Product description
     * @param {string} exportData.transportation_mode - 'maritime' or 'air'
     * @param {number} exportData.us_fob - FOB value in USD
     * @param {number} exportData.gross_weight - Gross weight in KG
     * @param {number} exportData.net_weight - Net weight in KG
     * @param {string} exportData.unit - Unit of measure (e.g., 'kg', 'ton')
     * @param {number} exportData.quantity - Quantity
     * @param {string} exportData.optimized_route_id - Route identifier (UUID)
     * @param {string} exportData.user_id - User identifier (UUID)
     * @returns {Promise<Object>} Created export with ID
     * @throws {Error} If validation fails or API request fails
     */
    async createExport(exportData) {
        try {
            const response = await axios.post(
                `${buildApiUrl('exports')}/`,
                exportData,
                { timeout: getApiTimeout() }
            );
            // Backend returns: { export_id, ...exportData, created_at, optimized_route: {...} }
            return response.data;
        } catch (error) {
            console.error('Error creating export:', error);
            if (error.response?.status === 401) {
                throw new Error('Authentication required');
            }
            if (error.response?.status === 400) {
                const errorDetail = error.response?.data?.detail;
                throw new Error(errorDetail || 'Invalid export data');
            }
            if (error.response?.status === 404) {
                throw new Error('Route or user not found');
            }
            const errorMessage = error.response?.data?.detail || 'Failed to create export';
            throw new Error(errorMessage);
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

            const response = await axios.post(buildApiUrl('exports'), exportData, {
                timeout: getApiTimeout()
            });
            return response.data;
        } catch (error) {
            console.error('Error creating export from route:', error);
            throw new Error('Failed to create export from route');
        }
    }

    /**
     * Change the route associated with an export
     * Requires authentication (JWT token)
     *
     * @param {string} exportId - Export identifier (UUID)
     * @param {string} routeId - New route identifier (UUID)
     * @returns {Promise<Object>} Updated export with new route
     * @throws {Error} If API request fails
     */
    async changeExportRoute(exportId, routeId) {
        try {
            const response = await axios.patch(
                `${buildApiUrl('exports')}/${exportId}/routes/${routeId}/assign`,
                {},
                { timeout: getApiTimeout() }
            );
            return response.data;
        } catch (error) {
            console.error(`Error changing route for export ${exportId}:`, error);
            if (error.response?.status === 401) {
                throw new Error('Authentication required');
            }
            if (error.response?.status === 404) {
                throw new Error('Export or route not found');
            }
            const errorMessage = error.response?.data?.detail || 'Failed to change export route';
            throw new Error(errorMessage);
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
            const response = await axios.put(
                `${buildApiUrl('exports')}/${exportId}`,
                updateData,
                { timeout: getApiTimeout() }
            );
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
            await axios.delete(
                `${buildApiUrl('exports')}/${exportId}`,
                { timeout: getApiTimeout() }
            );
        } catch (error) {
            console.error(`Error deleting export ${exportId}:`, error);
            throw new Error('Failed to delete export');
        }
    }
}

export default new ExportService();

