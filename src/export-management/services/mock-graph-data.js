/**
 * Mock Graph Data
 * Local data for testing visualization
 *
 * @module modules/visualization/services/mock-graph-data
 */

/**
 * Mock nodes (ports) data
 */
export const mockNodes = [
    // Origin Ports (Peru)
    {
        id: 'callao',
        name: 'Callao',
        type: 'origin',
        x: 100,
        y: 450,
        coordinates: { latitude: -12.05, longitude: -77.14 }
    },

    // Intermediate Ports - South America
    {
        id: 'balboa',
        name: 'Balboa',
        type: 'intermediate',
        x: 200,
        y: 400,
        coordinates: { latitude: 8.95, longitude: -79.55 }
    },
    {
        id: 'santos',
        name: 'Santos',
        type: 'intermediate',
        x: 250,
        y: 500,
        coordinates: { latitude: -23.96, longitude: -46.33 }
    },

    // Intermediate Ports - North America
    {
        id: 'losangeles',
        name: 'Los Angeles',
        type: 'intermediate',
        x: 150,
        y: 300,
        coordinates: { latitude: 33.74, longitude: -118.27 }
    },
    {
        id: 'miami',
        name: 'Miami',
        type: 'intermediate',
        x: 300,
        y: 350,
        coordinates: { latitude: 25.77, longitude: -80.19 }
    },
    {
        id: 'nuevayork',
        name: 'Nueva York',
        type: 'intermediate',
        x: 350,
        y: 280,
        coordinates: { latitude: 40.71, longitude: -74.01 }
    },

    // Intermediate Ports - Europe
    {
        id: 'rotterdam',
        name: 'Rotterdam',
        type: 'intermediate',
        x: 500,
        y: 250,
        coordinates: { latitude: 51.92, longitude: 4.48 }
    },
    {
        id: 'hamburgo',
        name: 'Hamburgo',
        type: 'intermediate',
        x: 520,
        y: 230,
        coordinates: { latitude: 53.55, longitude: 9.99 }
    },

    // Destination Ports - Asia
    {
        id: 'shanghai',
        name: 'Shanghai',
        type: 'destination',
        x: 750,
        y: 300,
        coordinates: { latitude: 31.23, longitude: 121.47 }
    },
    {
        id: 'tokyo',
        name: 'Tokyo',
        type: 'destination',
        x: 820,
        y: 270,
        coordinates: { latitude: 35.65, longitude: 139.84 }
    }
];

/**
 * Mock edges (routes) data
 */
export const mockEdges = [
    // From Callao (Origin)
    {
        source: 'callao',
        target: 'balboa',
        mode: 'maritime',
        distance: 2800,
        time: 4,
        cost: 45000
    },
    {
        source: 'callao',
        target: 'losangeles',
        mode: 'maritime',
        distance: 6500,
        time: 14,
        cost: 85000
    },
    {
        source: 'callao',
        target: 'santos',
        mode: 'maritime',
        distance: 5200,
        time: 12,
        cost: 65000
    },

    // From Balboa
    {
        source: 'balboa',
        target: 'miami',
        mode: 'maritime',
        distance: 3200,
        time: 7,
        cost: 50000
    },
    {
        source: 'balboa',
        target: 'rotterdam',
        mode: 'maritime',
        distance: 9600,
        time: 20,
        cost: 120000
    },
    {
        source: 'balboa',
        target: 'shanghai',
        mode: 'maritime',
        distance: 18000,
        time: 32,
        cost: 180000
    },

    // From Los Angeles
    {
        source: 'losangeles',
        target: 'shanghai',
        mode: 'maritime',
        distance: 11000,
        time: 18,
        cost: 110000
    },
    {
        source: 'losangeles',
        target: 'tokyo',
        mode: 'maritime',
        distance: 9000,
        time: 14,
        cost: 95000
    },
    {
        source: 'losangeles',
        target: 'miami',
        mode: 'air',
        distance: 3500,
        time: 1,
        cost: 85000
    },

    // From Miami
    {
        source: 'miami',
        target: 'nuevayork',
        mode: 'maritime',
        distance: 2000,
        time: 3,
        cost: 35000
    },
    {
        source: 'miami',
        target: 'rotterdam',
        mode: 'maritime',
        distance: 7800,
        time: 15,
        cost: 95000
    },

    // From Nueva York
    {
        source: 'nuevayork',
        target: 'rotterdam',
        mode: 'maritime',
        distance: 6000,
        time: 13,
        cost: 80000
    },
    {
        source: 'nuevayork',
        target: 'hamburgo',
        mode: 'maritime',
        distance: 6500,
        time: 14,
        cost: 85000
    },

    // From Rotterdam
    {
        source: 'rotterdam',
        target: 'shanghai',
        mode: 'maritime',
        distance: 19000,
        time: 32,
        cost: 150000
    },
    {
        source: 'rotterdam',
        target: 'hamburgo',
        mode: 'maritime',
        distance: 600,
        time: 1,
        cost: 10000
    },

    // From Hamburgo
    {
        source: 'hamburgo',
        target: 'shanghai',
        mode: 'maritime',
        distance: 18500,
        time: 30,
        cost: 145000
    },

    // From Santos
    {
        source: 'santos',
        target: 'rotterdam',
        mode: 'maritime',
        distance: 10500,
        time: 22,
        cost: 125000
    },
    {
        source: 'santos',
        target: 'shanghai',
        mode: 'maritime',
        distance: 20000,
        time: 35,
        cost: 190000
    }
];

/**
 * Mock optimal route (highlighted path)
 */
export const mockOptimalRoute = [
    'callao',
    'balboa',
    'rotterdam',
    'shanghai'
];

/**
 * Get mock graph data
 *
 * @returns {Object} Object with nodes and edges
 */
export function getMockGraphData() {
    return {
        nodes: mockNodes,
        edges: mockEdges,
        optimalRoute: mockOptimalRoute
    };
}

export default getMockGraphData;