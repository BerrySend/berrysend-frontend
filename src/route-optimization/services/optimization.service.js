/**
 * Optimization Service
 * Handles all API operations related to route optimization
 *
 * @module modules/route-optimization/services/optimization.service
 */

import axios from 'axios';
import Algorithm from "@/route-optimization/model/algorithm.entity.js";
import {PredefinedAlgorithms} from "@/route-optimization/model/algorithm.entity.js";
import OptimizationConfig from "@/route-optimization/model/optimization-config.entity.js";
import { buildApiUrl, getApiTimeout } from '@/config/environment.js';

/**
 * Optimization Service class for API interactions
 */
class OptimizationService {
    /**
     * Fetches all available algorithms
     *
     * @returns {Promise<Array<Algorithm>>} Array of Algorithm instances
     * @throws {Error} If API request fails
     */
    async getAvailableAlgorithms() {
        try {
            const response = await axios.get(buildApiUrl('algorithms'), {
                timeout: getApiTimeout()
            });
            return Algorithm.fromAPIArray(response.data);
        } catch (error) {
            console.error('Error fetching algorithms:', error);

            // Fallback to predefined algorithms if API fails
            return Object.values(PredefinedAlgorithms).map(algo =>
                Algorithm.fromAPI(algo)
            );
        }
    }

    /**
     * Fetches a specific algorithm by ID
     *
     * @param {string} algorithmId - Algorithm identifier
     * @returns {Promise<Algorithm>} Algorithm instance
     * @throws {Error} If algorithm not found or API request fails
     */
    async getAlgorithmById(algorithmId) {
        try {
            const response = await axios.get(`${buildApiUrl('algorithms')}/${algorithmId}`, {
                timeout: getApiTimeout()
            });
            return Algorithm.fromAPI(response.data);
        } catch (error) {
            console.error(`Error fetching algorithm ${algorithmId}:`, error);

            // Fallback to predefined algorithm
            const predefined = Object.values(PredefinedAlgorithms).find(
                algo => algo.id === algorithmId
            );

            if (predefined) {
                return Algorithm.fromAPI(predefined);
            }

            throw new Error(`Algorithm not found: ${algorithmId}`);
        }
    }

    /**
     * Computes optimal route with given parameters
     *
     * @param {Object} params - Optimization parameters
     * @param {string} params.source - Source port ID (UUID)
     * @param {string} params.destination - Destination port ID (UUID)
     * @param {string} params.mode - Transport mode ('maritime' or 'air')
     * @param {string} params.algorithm_name - Algorithm name ('dijkstra', 'a*', 'bellman-ford')
     * @param {number} params.export_weight - Export weight in TONS
     * @param {Object} params.parameters - Algorithm specific parameters (only for bellman-ford)
     * @returns {Promise<Object>} Optimization result with optimal path
     * @throws {Error} If validation fails or API request fails
     */
    async computeOptimalRoute(params) {
        try {
            const payload = {
                source: params.source,
                destination: params.destination,
                mode: params.mode,
                algorithm_name: params.algorithm_name,
                export_weight: params.export_weight
            };

            // Only include parameters for bellman-ford
            if (params.algorithm_name === 'bellman-ford' && params.parameters) {
                payload.parameters = params.parameters;
            }

            const response = await axios.post(
                buildApiUrl('optimization'),
                payload,
                { timeout: getApiTimeout() }
            );
            
            // Backend returns: { optimized_route_id, source, destination, connections, total_distance, total_time, total_cost, algorithm_used, parameters_used }
            return response.data;
        } catch (error) {
            console.error('Error computing optimal route:', error);
            if (error.response?.status === 400) {
                const errorDetail = error.response?.data?.detail;
                throw new Error(errorDetail || 'Invalid parameters for route optimization');
            }
            if (error.response?.status === 404) {
                throw new Error('Port not found');
            }
            const errorMessage = error.response?.data?.detail || 'Failed to compute optimal route';
            throw new Error(errorMessage);
        }
    }

    /**
     * Executes route optimization with given configuration
     *
     * @param {OptimizationConfig} config - Optimization configuration
     * @returns {Promise<Object>} Optimization result
     * @throws {Error} If validation fails or API request fails
     */
    async executeOptimization(config) {
        const validation = config.validate();

        if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }

        try {
            const response = await axios.post(
                buildApiUrl('optimization'),
                config.toJSON(),
                { timeout: getApiTimeout() }
            );
            return response.data;
        } catch (error) {
            console.error('Error executing optimization:', error);
            throw new Error('Failed to execute optimization');
        }
    }

    /**
     * Saves optimization configuration
     *
     * @param {OptimizationConfig} config - Configuration to save
     * @returns {Promise<OptimizationConfig>} Saved configuration with ID
     * @throws {Error} If validation fails or API request fails
     */
    async saveConfiguration(config) {
        const validation = config.validate();

        if (!validation.isValid) {
            throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }

        try {
            const response = await axios.post(
                `${buildApiUrl('optimization')}/configurations`,
                config.toJSON(),
                { timeout: getApiTimeout() }
            );
            return OptimizationConfig.fromAPI(response.data);
        } catch (error) {
            console.error('Error saving configuration:', error);
            throw new Error('Failed to save configuration');
        }
    }

    /**
     * Fetches saved configurations
     *
     * @returns {Promise<Array<OptimizationConfig>>} Array of configurations
     * @throws {Error} If API request fails
     */
    async getSavedConfigurations() {
        try {
            const response = await axios.get(
                `${buildApiUrl('optimization')}/configurations`,
                { timeout: getApiTimeout() }
            );
            return response.data.map(data => OptimizationConfig.fromAPI(data));
        } catch (error) {
            console.error('Error fetching configurations:', error);
            throw new Error('Failed to fetch saved configurations');
        }
    }

    /**
     * Compares multiple algorithms for given configuration
     *
     * @param {OptimizationConfig} config - Configuration to test
     * @param {Array<string>} algorithmIds - Algorithms to compare
     * @returns {Promise<Object>} Comparison results
     * @throws {Error} If API request fails
     */
    async compareAlgorithms(config, algorithmIds) {
        try {
            const response = await axios.post(
                `${buildApiUrl('optimization')}/compare`,
                {
                    configuration: config.toJSON(),
                    algorithms: algorithmIds
                },
                { timeout: getApiTimeout() }
            );
            return response.data;
        } catch (error) {
            console.error('Error comparing algorithms:', error);
            throw new Error('Failed to compare algorithms');
        }
    }

    /**
     * Gets optimization statistics
     *
     * @returns {Promise<Object>} Statistics object
     * @throws {Error} If API request fails
     */
    async getOptimizationStatistics() {
        try {
            const response = await axios.get(
                `${buildApiUrl('optimization')}/statistics`,
                { timeout: getApiTimeout() }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching optimization statistics:', error);
            throw new Error('Failed to fetch optimization statistics');
        }
    }

    /**
     * Validates if optimization is feasible
     *
     * @param {string} originPortId - Origin port ID
     * @param {string} destinationPortId - Destination port ID
     * @returns {Promise<Object>} Feasibility result with available routes
     * @throws {Error} If API request fails
     */
    async checkFeasibility(originPortId, destinationPortId) {
        try {
            const response = await axios.post(
                `${buildApiUrl('optimization')}/feasibility`,
                { originPortId, destinationPortId },
                { timeout: getApiTimeout() }
            );
            return response.data;
        } catch (error) {
            console.error('Error checking feasibility:', error);
            throw new Error('Failed to check route feasibility');
        }
    }

    /**
     * Cancels a running optimization
     *
     * @param {string} optimizationId - Optimization execution ID
     * @returns {Promise<void>}
     * @throws {Error} If API request fails
     */
    async cancelOptimization(optimizationId) {
        try {
            await axios.post(
                `${buildApiUrl('optimization')}/${optimizationId}/cancel`,
                {},
                { timeout: getApiTimeout() }
            );
        } catch (error) {
            console.error(`Error canceling optimization ${optimizationId}:`, error);
            throw new Error('Failed to cancel optimization');
        }
    }
}

// Export singleton instance
export default new OptimizationService();