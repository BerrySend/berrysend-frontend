/**
 * Main Application Entry Point
 * Initializes Vue application with router and global configurations
 *
 * @module main
 */

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import { setupAxiosInterceptor } from './shared/interceptors/axios.interceptor.js';
import { useAuthStore } from './shared/stores/auth.store.js';
import './assets/tailwind.css';
import {getAppName} from "@/config/environment.js";

/**
 * Create Pinia instance
 */
const pinia = createPinia();

/**
 * Create Vue application instance
 */
const app = createApp(App);

/**
 * Global error handler
 * Catches and logs unhandled errors in components
 */
app.config.errorHandler = (err, instance, info) => {
    console.error('Global error:', err);
    console.error('Error info:', info);
    console.error('Component instance:', instance);
};

/**
 * Global warning handler (development only)
 * Catches and logs warnings during development
 */
if (import.meta.env.DEV) {
    app.config.warnHandler = (msg, instance, trace) => {
        console.warn('Warning:', msg);
        console.warn('Trace:', trace);
    };
}

/**
 * Global properties
 * Available in all components via this.$appName, etc.
 */
app.config.globalProperties.$appName = getAppName();
app.config.globalProperties.$version = config.appVersion;
app.config.globalProperties.$apiBaseUrl = config.apiBaseUrl;
app.config.globalProperties.$config = config;

/**
 * Register global components
 * Components that are used frequently across the app
 */
// Example: app.component('BaseButton', BaseButton);

/**
 * Install plugins
 */
app.use(pinia);
app.use(router);

/**
 * Setup axios interceptor for authentication
 */
setupAxiosInterceptor();

/**
 * Initialize auth store from localStorage
 */
const authStore = useAuthStore();
authStore.initialize();

/**
 * Mount application to DOM
 */
app.mount('#app');

/**
 * Log application startup in development
 */
if (import.meta.env.DEV) {
    console.log('🚀 BerrySend application started');
    console.log('Environment:', import.meta.env.MODE);
    console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);
}