/**
 * Graph Node Entity
 * Represents a node (port) in the transportation network graph
 *
 */

/**
 * Node type enumeration
 */
export const NodeType = {
    ORIGIN: 'origin',
    DESTINATION: 'destination',
    INTERMEDIATE: 'intermediate'
};

/**
 * GraphNode entity class
 */
export class GraphNode {
    /**
     * Creates a new GraphNode instance
     *
     * @param {Object} data - Node data
     * @param {string} data.id - Unique identifier
     * @param {string} data.name - Node name
     * @param {string} data.type - Node type (origin, destination, intermediate)
     * @param {number} data.x - X coordinate for visualization
     * @param {number} data.y - Y coordinate for visualization
     * @param {Object} data.coordinates - Real geographic coordinates
     * @param {number} data.coordinates.latitude - Latitude
     * @param {number} data.coordinates.longitude - Longitude
     */
    constructor(data = {}) {
        this.id = data.id || null;
        this.name = data.name || '';
        this.type = data.type || NodeType.INTERMEDIATE;
        this.x = data.x || 0;
        this.y = data.y || 0;
        this.coordinates = {
            latitude: data.coordinates?.latitude || 0,
            longitude: data.coordinates?.longitude || 0
        };
    }

    /**
     * Gets the color for this node type
     *
     * @returns {string} Hex color code
     */
    getColor() {
        const colorMap = {
            [NodeType.ORIGIN]: '#3b82f6',      // Blue
            [NodeType.DESTINATION]: '#a855f7',  // Purple
            [NodeType.INTERMEDIATE]: '#6b7280'  // Gray
        };
        return colorMap[this.type] || '#6b7280';
    }

    /**
     * Gets the radius size for this node type
     *
     * @returns {number} Radius in pixels
     */
    getRadius() {
        const sizeMap = {
            [NodeType.ORIGIN]: 12,
            [NodeType.DESTINATION]: 12,
            [NodeType.INTERMEDIATE]: 8
        };
        return sizeMap[this.type] || 8;
    }

    /**
     * Converts to plain object
     *
     * @returns {Object}
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            x: this.x,
            y: this.y,
            coordinates: this.coordinates
        };
    }

    /**
     * Creates instance from API response
     *
     * @param {Object} data - API response data
     * @returns {GraphNode}
     */
    static fromAPI(data) {
        return new GraphNode(data);
    }
}

export default GraphNode;