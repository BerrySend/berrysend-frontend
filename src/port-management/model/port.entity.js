/**
 * Port Model
 * Represents a port in the transportation network
 *
 * @module modules/port-management/models/Port
 */

/**
 * Port entity class
 */
export class Port {
    /**
     * Creates a new Port instance
     *
     * @param {Object} data - Port data
     * @param {string} data.id - Unique identifier
     * @param {string} data.name - Port name
     * @param {string} data.country - Country where port is located
     * @param {string} data.type - Port type: 'origin', 'destination', 'intermediate'
     * @param {number} data.capacity - Port capacity in tons per month
     * @param {Object} data.coordinates - Geographic coordinates
     * @param {number} data.coordinates.latitude - Latitude
     * @param {number} data.coordinates.longitude - Longitude
     * @param {number} data.connections - Number of connections
     */
    constructor(data = {}) {
        this.id = data.id || null;
        this.name = data.name || '';
        this.country = data.country || '';
        this.type = data.type || 'intermediate';
        this.capacity = data.capacity || 0;
        this.coordinates = {
            latitude: data.coordinates?.latitude || 0,
            longitude: data.coordinates?.longitude || 0
        };
        this.connections = data.connections || 0;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = data.updatedAt || new Date().toISOString();
    }

    /**
     * Validates if the port data is complete and valid
     *
     * @returns {Object} Validation result with isValid flag and errors array
     */
    validate() {
        const errors = [];

        if (!this.name || this.name.trim().length === 0) {
            errors.push('Port name is required');
        }

        if (!this.country || this.country.trim().length === 0) {
            errors.push('Country is required');
        }

        if (!['origin', 'destination', 'intermediate'].includes(this.type)) {
            errors.push('Invalid port type');
        }

        if (this.capacity < 0) {
            errors.push('Capacity must be a positive number');
        }

        if (this.coordinates.latitude < -90 || this.coordinates.latitude > 90) {
            errors.push('Latitude must be between -90 and 90');
        }

        if (this.coordinates.longitude < -180 || this.coordinates.longitude > 180) {
            errors.push('Longitude must be between -180 and 180');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Returns a formatted coordinate string
     *
     * @returns {string} Formatted coordinates (e.g., "-12.05°, -77.14°")
     */
    getFormattedCoordinates() {
        const lat = this.coordinates.latitude.toFixed(2);
        const lon = this.coordinates.longitude.toFixed(2);
        return `${lat}°, ${lon}°`;
    }

    /**
     * Returns formatted capacity with units
     *
     * @returns {string} Formatted capacity (e.g., "50,000 ton/month")
     */
    getFormattedCapacity() {
        return `${this.capacity.toLocaleString()} ton/month`;
    }

    /**
     * Checks if port can be used as origin
     *
     * @returns {boolean}
     */
    isOrigin() {
        return this.type === 'origin';
    }

    /**
     * Checks if port can be used as destination
     *
     * @returns {boolean}
     */
    isDestination() {
        return this.type === 'destination';
    }

    /**
     * Checks if port is an intermediate point
     *
     * @returns {boolean}
     */
    isIntermediate() {
        return this.type === 'intermediate';
    }

    /**
     * Converts port to plain object for API transmission
     *
     * @returns {Object} Plain object representation
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            country: this.country,
            type: this.type,
            capacity: this.capacity,
            coordinates: this.coordinates,
            connections: this.connections,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    /**
     * Creates a Port instance from API response
     *
     * @param {Object} data - API response data
     * @returns {Port} New Port instance
     */
    static fromAPI(data) {
        // Map backend response to frontend model
        return new Port({
            id: data.id,
            name: data.name,
            country: data.country,
            type: data.type || 'intermediate', // maritime/air from backend
            capacity: data.capacity || 0,
            coordinates: {
                latitude: data.latitude || 0,
                longitude: data.longitude || 0
            },
            connections: data.connections || 0,
            createdAt: data.createdAt || data.created_at,
            updatedAt: data.updatedAt || data.updated_at
        });
    }

    /**
     * Creates multiple Port instances from API response array
     *
     * @param {Array} dataArray - Array of API response data
     * @returns {Array<Port>} Array of Port instances
     */
    static fromAPIArray(dataArray) {
        return dataArray.map(data => Port.fromAPI(data));
    }
}

/**
 * Port type constants
 */
export const PortType = {
    ORIGIN: 'origin',
    DESTINATION: 'destination',
    INTERMEDIATE: 'intermediate'
};

/**
 * Port type labels for UI display
 */
export const PortTypeLabels = {
    [PortType.ORIGIN]: 'Origin',
    [PortType.DESTINATION]: 'Destination',
    [PortType.INTERMEDIATE]: 'Intermediate'
};

export default Port;