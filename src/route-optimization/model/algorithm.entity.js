/**
 * Algorithm Entity
 * Represents an optimization algorithm with its properties and metrics
 *
 * @module modules/route-optimization/models/algorithm.entity
 */

/**
 * Algorithm entity class
 */
export class Algorithm {
    /**
     * Creates a new Algorithm instance
     *
     * @param {Object} data - Algorithm data
     * @param {string} data.id - Unique identifier
     * @param {string} data.name - Algorithm name (e.g., 'Dijkstra')
     * @param {string} data.description - Algorithm description
     * @param {string} data.complexity - Time complexity notation (e.g., 'O((V + E) log V)')
     * @param {Object} data.metrics - Performance metrics
     * @param {number} data.metrics.speed - Speed percentage (0-100)
     * @param {number} data.metrics.memoryUsage - Memory usage percentage (0-100)
     * @param {number} data.metrics.precision - Precision percentage (0-100)
     * @param {Array<string>} data.advantages - List of advantages
     * @param {Array<string>} data.considerations - List of considerations/limitations
     * @param {boolean} data.isRecommended - Whether this algorithm is recommended
     */
    constructor(data = {}) {
        this.id = data.id || null;
        this.name = data.name || '';
        this.description = data.description || '';
        this.complexity = data.complexity || 'N/A';
        this.metrics = {
            speed: data.metrics?.speed ?? data.speed ?? 0,
            memoryUsage: data.metrics?.memoryUsage ?? data.memory_usage ?? data.memoryUsage ?? 0,
            precision: data.metrics?.precision ?? data.precision ?? 0
        };
        this.advantages = Array.isArray(data.advantages) ? data.advantages : (data.advantages ? [data.advantages] : []);
        this.considerations = Array.isArray(data.considerations) ? data.considerations : (data.considerations ? [data.considerations] : []);
        this.isRecommended = data.isRecommended ?? data.is_recommended ?? false;
        this.createdAt = data.createdAt || data.created_at || new Date().toISOString();
    }

    /**
     * Validates if the algorithm data is complete and valid
     *
     * @returns {Object} Validation result with isValid flag and errors array
     */
    validate() {
        const errors = [];

        if (!this.name || this.name.trim().length === 0) {
            errors.push('Algorithm name is required');
        }

        if (!this.description || this.description.trim().length === 0) {
            errors.push('Algorithm description is required');
        }

        if (this.metrics.speed < 0 || this.metrics.speed > 100) {
            errors.push('Speed must be between 0 and 100');
        }

        if (this.metrics.memoryUsage < 0 || this.metrics.memoryUsage > 100) {
            errors.push('Memory usage must be between 0 and 100');
        }

        if (this.metrics.precision < 0 || this.metrics.precision > 100) {
            errors.push('Precision must be between 0 and 100');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Gets the overall performance score (average of all metrics)
     *
     * @returns {number} Average score (0-100)
     */
    getPerformanceScore() {
        const { speed, memoryUsage, precision } = this.metrics;
        return Math.round((speed + (100 - memoryUsage) + precision) / 3);
    }

    /**
     * Checks if algorithm is suitable for large datasets
     *
     * @returns {boolean}
     */
    isEfficientForLargeData() {
        return this.metrics.speed >= 70 && this.metrics.memoryUsage <= 40;
    }

    /**
     * Converts algorithm to plain object for API transmission
     *
     * @returns {Object} Plain object representation
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            complexity: this.complexity,
            metrics: this.metrics,
            advantages: this.advantages,
            considerations: this.considerations,
            isRecommended: this.isRecommended,
            createdAt: this.createdAt
        };
    }

    /**
     * Creates an Algorithm instance from API response
     *
     * @param {Object} data - API response data
     * @returns {Algorithm} New Algorithm instance
     */
    static fromAPI(data) {
        return new Algorithm(data);
    }

    /**
     * Creates multiple Algorithm instances from API response array
     *
     * @param {Array} dataArray - Array of API response data
     * @returns {Array<Algorithm>} Array of Algorithm instances
     */
    static fromAPIArray(dataArray) {
        return dataArray.map(data => Algorithm.fromAPI(data));
    }
}

/**
 * Pre-configured algorithms
 */
export const PredefinedAlgorithms = {
    DIJKSTRA: {
        id: 'dijkstra',
        name: 'Dijkstra',
        description: 'Encuentra el camino más corto garantizado',
        complexity: 'O((V + E) log V)',
        metrics: {
            speed: 85,
            memoryUsage: 30,
            precision: 100
        },
        advantages: [
            'Garantiza la solución óptima',
            'Eficiente para grafos dispersos',
            'Ampliamente probado y confiable'
        ],
        considerations: [
            'No considera heurísticas',
            'Puede ser lento en grafos muy grandes'
        ],
        isRecommended: true
    },
    ASTAR: {
        id: 'astar',
        name: 'A* (A-Star)',
        description: 'Algoritmo heurístico que optimiza la búsqueda usando distancia euclidiana como guía',
        complexity: 'O(b^d) - depende de la heurística',
        metrics: {
            speed: 95,
            memoryUsage: 45,
            precision: 95
        },
        advantages: [
            'Muy rápido con buenas heurísticas',
            'Óptimo con heurística admisible',
            'Reduce búsqueda innecesaria'
        ],
        considerations: [
            'Requiere función heurística',
            'Mayor uso de memoria'
        ],
        isRecommended: true
    },
    BELLMAN_FORD: {
        id: 'bellman-ford',
        name: 'Bellman-Ford',
        description: 'Maneja pesos negativos',
        complexity: 'O(V * E)',
        metrics: {
            speed: 50,
            memoryUsage: 25,
            precision: 100
        },
        advantages: [
            'Detecta ciclos negativos',
            'Funciona con pesos negativos',
            'Simple de implementar'
        ],
        considerations: [
            'Más lento que Dijkstra',
            'No necesario si no hay pesos negativos'
        ],
        isRecommended: false
    },
    // FLOYD_WARSHALL removed - not available in backend
};

export default Algorithm;