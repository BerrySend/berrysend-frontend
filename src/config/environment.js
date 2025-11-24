/**
 * Environment Configuration
 * Centralizes all environment variables for the application
 *
 * @module config/environment
 */

/**
 * Get all environment variables with defaults
 */
export const getEnvironmentConfig = () => {
  const config = {
    // API Configuration
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    apiTimeout: import.meta.env.VITE_API_TIMEOUT || 30000,

    // Google Maps Configuration
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',

    // Application Settings
    appName: import.meta.env.VITE_APP_NAME || 'BerrySend',
    appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',

    // Endpoints (can be customized via env)
    endpoints: {
      users: import.meta.env.VITE_USER_ENDPOINT_PATH || '/users',
      ports: import.meta.env.VITE_PORTS_ENDPOINT_PATH || '/api/v1/ports',
      portConnections: import.meta.env.VITE_PORT_CONNECTIONS_ENDPOINT_PATH || '/api/v1/port-connections',
      routes: import.meta.env.VITE_ROUTES_ENDPOINT_PATH || '/api/v1/routes',
      exports: import.meta.env.VITE_EXPORTS_ENDPOINT_PATH || '/exports',
      algorithms: import.meta.env.VITE_ALGORITHMS_ENDPOINT_PATH || '/algorithms',
      optimization: import.meta.env.VITE_OPTIMIZATION_ENDPOINT_PATH || '/api/v1/routes/compute'
    },

    // Environment flags
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD
  };

  return config;
};

// Export individual accessors for convenience
export const config = getEnvironmentConfig();

export const getApiBaseUrl = () => config.apiBaseUrl;
export const getApiTimeout = () => config.apiTimeout;
export const getGoogleMapsApiKey = () => config.googleMapsApiKey;
export const getAppName = () => config.appName;
export const getEndpoint = (key) => config.endpoints[key] || '';

/**
 * Build complete API URL for an endpoint
 * @param {string} endpointKey - Key of the endpoint (e.g., 'ports', 'exports')
 * @returns {string} Complete API URL
 */
export const buildApiUrl = (endpointKey) => {
  const baseUrl = getApiBaseUrl();
  const endpoint = getEndpoint(endpointKey);
  return `${baseUrl}${endpoint}`;
};

/**
 * Validate critical environment variables
 * @throws {Error} If critical variables are missing
 */
export const validateEnvironment = () => {
  if (!config.googleMapsApiKey) {
    console.warn('Warning: VITE_GOOGLE_MAPS_API_KEY is not configured');
  }

  if (!config.apiBaseUrl) {
    throw new Error('Critical: VITE_API_BASE_URL is not configured');
  }
};

