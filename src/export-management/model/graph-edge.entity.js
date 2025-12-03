/**
 * Graph Edge Entity
 * Represents an edge (route) in the transportation network graph
 *
 * @module modules/visualization/models/graph-edge.entity
 */

/**
 * Transport mode enumeration
 */
export const TransportMode = {
    MARITIME: 'maritime',
    AIR: 'air'
};

/**
 * GraphEdge entity class
 */
export class GraphEdge {
    /**
     * Creates a new GraphEdge instance
     *
     * @param {Object} data - Edge data
     * @param {string} data.id - Unique identifier
     * @param {string} data.source - Source node ID
     * @param {string} data.target - Target node ID
     * @param {string} data.mode - Transport mode (maritime, air)
     * @param {number} data.distance - Distance in kilometers
     * @param {number} data.time - Time in days
     * @param {number} data.cost - Cost in USD
     * @param {boolean} data.isOptimal - Whether this edge is part of optimal route
     */
    constructor(data = {}) {
        this.id = data.id || `${data.source || data.port_a_id}-${data.target || data.port_b_id}`;
        this.source = data.source || data.port_a_id || null;
        this.target = data.target || data.port_b_id || null;
        this.mode = data.mode || data.route_type || TransportMode.MARITIME;

        this.distance = data.distance || data.distance_km || 0;
        this.time = data.time || data.time_hours || 0;
        this.cost = data.cost || data.cost_usd || 0;
        this.isOptimal = data.isOptimal || false;

        this.sourceName = data.port_a_name || null;
        this.targetName = data.port_b_name || null;
        this.isRestricted = data.is_restricted || false;
    }

    /**
     * Gets the color for this edge based on transport mode
     *
     * @returns {string} Hex color code
     */
    getColor() {
        if (this.isOptimal) {
            return '#ef4444'; // Red for optimal route
        }

        const colorMap = {
            [TransportMode.MARITIME]: '#3b82f6', // Blue
            [TransportMode.AIR]: '#a855f7'       // Purple
        };
        return colorMap[this.mode] || '#6b7280';
    }

    /**
     * Gets the stroke width for this edge
     *
     * @returns {number} Width in pixels
     */
    getStrokeWidth() {
        return this.isOptimal ? 3 : 2;
    }

    /**
     * Gets from node ID (alias for source)
     *
     * @returns {string}
     */
    get from() {
        return this.source;
    }

    /**
     * Gets to node ID (alias for target)
     *
     * @returns {string}
     */
    get to() {
        return this.target;
    }

    /**
     * Gets formatted distance
     *
     * @returns {string}
     */
    getFormattedDistance() {
        return `${this.distance.toLocaleString()} km`;
    }

    /**
     * Gets formatted time
     *
     * @returns {string}
     */
    getFormattedTime() {
        return `${this.time} días`;
    }

    /**
     * Gets formatted cost
     *
     * @returns {string}
     */
    getFormattedCost() {
        return `$${this.cost.toLocaleString()}`;
    }

    /**
     * Converts to plain object
     *
     * @returns {Object}
     */
    toJSON() {
        return {
            id: this.id,
            source: this.source,
            target: this.target,
            mode: this.mode,
            distance: this.distance,
            time: this.time,
            cost: this.cost,
            isOptimal: this.isOptimal
        };
    }

    /**
     * Creates instance from API response
     *
     * @param {Object} data - API response data
     * @returns {GraphEdge}
     */
    static fromAPI(data) {
        return new GraphEdge(data);
    }
}

export default GraphEdge;