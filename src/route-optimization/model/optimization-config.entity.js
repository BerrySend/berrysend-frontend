/**
 * Optimization Configuration Entity
 * Represents the configuration for route optimization
 *
 * @module modules/route-optimization/models/optimization-config.entity
 */

/**
 * Optimization objective types
 */
export const OptimizationObjective = {
    MINIMIZE_TIME: 'minimize_time',
    MINIMIZE_COST: 'minimize_cost',
    MINIMIZE_DISTANCE: 'minimize_distance',
    MAXIMIZE_CAPACITY: 'maximize_capacity'
};

/**
 * Optimization objective labels
 */
export const OptimizationObjectiveLabels = {
    [OptimizationObjective.MINIMIZE_TIME]: 'Minimizar Tiempo',
    [OptimizationObjective.MINIMIZE_COST]: 'Minimizar Costo',
    [OptimizationObjective.MINIMIZE_DISTANCE]: 'Minimizar Distancia',
    [OptimizationObjective.MAXIMIZE_CAPACITY]: 'Maximizar Capacidad'
};

/**
 * OptimizationConfig entity class
 */
export class OptimizationConfig {
    /**
     * Creates a new OptimizationConfig instance
     *
     * @param {Object} data - Configuration data
     * @param {string} data.id - Unique identifier
     * @param {string} data.originPortId - Origin port ID
     * @param {string} data.destinationPortId - Destination port ID
     * @param {number} data.cargoAmount - Cargo amount in tons
     * @param {string} data.objective - Optimization objective
     * @param {string} data.algorithmId - Selected algorithm ID
     * @param {Object} data.constraints - Additional constraints
     * @param {number} data.constraints.maxTransfers - Maximum number of transfers allowed
     * @param {Array<string>} data.constraints.allowedTransportModes - Allowed transport modes
     * @param {number} data.constraints.maxTime - Maximum time in days
     * @param {number} data.constraints.maxCost - Maximum cost
     */
    constructor(data = {}) {
        this.id = data.id || null;
        this.originPortId = data.originPortId || null;
        this.destinationPortId = data.destinationPortId || null;
        this.cargoAmount = data.cargoAmount || 1000;
        this.objective = data.objective || OptimizationObjective.MINIMIZE_TIME;
        this.algorithmId = data.algorithmId || 'dijkstra';
        this.constraints = {
            maxTransfers: data.constraints?.maxTransfers || null,
            allowedTransportModes: data.constraints?.allowedTransportModes || ['maritime', 'air'],
            maxTime: data.constraints?.maxTime || null,
            maxCost: data.constraints?.maxCost || null
        };
        this.createdAt = data.createdAt || new Date().toISOString();
    }

    /**
     * Validates if the configuration is complete and valid
     *
     * @returns {Object} Validation result with isValid flag and errors array
     */
    validate() {
        const errors = [];

        if (!this.originPortId) {
            errors.push('Origin port is required');
        }

        if (!this.destinationPortId) {
            errors.push('Destination port is required');
        }

        if (this.originPortId === this.destinationPortId) {
            errors.push('Origin and destination ports must be different');
        }

        if (this.cargoAmount <= 0) {
            errors.push('Cargo amount must be greater than 0');
        }

        if (!Object.values(OptimizationObjective).includes(this.objective)) {
            errors.push('Invalid optimization objective');
        }

        if (!this.algorithmId) {
            errors.push('Algorithm selection is required');
        }

        if (this.constraints.maxTransfers !== null && this.constraints.maxTransfers < 0) {
            errors.push('Maximum transfers cannot be negative');
        }

        if (this.constraints.maxTime !== null && this.constraints.maxTime <= 0) {
            errors.push('Maximum time must be greater than 0');
        }

        if (this.constraints.maxCost !== null && this.constraints.maxCost <= 0) {
            errors.push('Maximum cost must be greater than 0');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Gets formatted cargo amount
     *
     * @returns {string} Formatted cargo amount (e.g., "1,000 tons")
     */
    getFormattedCargoAmount() {
        return `${this.cargoAmount.toLocaleString()} toneladas`;
    }

    /**
     * Gets objective label
     *
     * @returns {string} Human-readable objective label
     */
    getObjectiveLabel() {
        return OptimizationObjectiveLabels[this.objective] || 'Unknown';
    }

    /**
     * Checks if maritime transport is allowed
     *
     * @returns {boolean}
     */
    isMaritimeAllowed() {
        return this.constraints.allowedTransportModes.includes('maritime');
    }

    /**
     * Checks if air transport is allowed
     *
     * @returns {boolean}
     */
    isAirAllowed() {
        return this.constraints.allowedTransportModes.includes('air');
    }

    /**
     * Converts configuration to plain object for API transmission
     *
     * @returns {Object} Plain object representation
     */
    toJSON() {
        return {
            id: this.id,
            originPortId: this.originPortId,
            destinationPortId: this.destinationPortId,
            cargoAmount: this.cargoAmount,
            objective: this.objective,
            algorithmId: this.algorithmId,
            constraints: this.constraints,
            createdAt: this.createdAt
        };
    }

    /**
     * Creates an OptimizationConfig instance from API response
     *
     * @param {Object} data - API response data
     * @returns {OptimizationConfig} New OptimizationConfig instance
     */
    static fromAPI(data) {
        return new OptimizationConfig(data);
    }
}

export default OptimizationConfig;