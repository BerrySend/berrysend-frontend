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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

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
            const response = await axios.get(`${API_BASE_URL}/optimization/algorithms`);
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
            const response = await axios.get(`${API_BASE_URL}/optimization/algorithms/${algorithmId}`);
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
     * @param {string} params.source - Source port ID
     * @param {string} params.destination - Destination port ID
     * @param {string} params.mode - Transport mode
     * @param {string} params.algorithm_name - Algorithm name
     * @param {number} params.export_weight - Export weight in tons
     * @param {Object} params.parameters - Algorithm specific parameters
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
                export_weight: params.export_weight,
                parameters: params.parameters || {}
            };

            const response = await axios.post(
                `${API_BASE_URL}/v1/routes/compute`,
                payload
            );
            return response.data;
        } catch (error) {
            console.error('Error computing optimal route:', error);
            throw new Error('Failed to compute optimal route');
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
                `${API_BASE_URL}/optimization/compute`,
                config.toJSON()
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
                `${API_BASE_URL}/optimization/configurations`,
                config.toJSON()
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
            const response = await axios.get(`${API_BASE_URL}/optimization/configurations`);
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
                `${API_BASE_URL}/optimization/compare`,
                {
                    configuration: config.toJSON(),
                    algorithms: algorithmIds
                }
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
            const response = await axios.get(`${API_BASE_URL}/optimization/statistics`);
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
                `${API_BASE_URL}/optimization/feasibility`,
                { originPortId, destinationPortId }
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
            await axios.post(`${API_BASE_URL}/optimization/${optimizationId}/cancel`);
        } catch (error) {
            console.error(`Error canceling optimization ${optimizationId}:`, error);
            throw new Error('Failed to cancel optimization');
        }
    }
}

// Export singleton instance
export default new OptimizationService();