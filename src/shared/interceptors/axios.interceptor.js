/**
 * Axios Interceptor
 * Handles authentication tokens and error responses globally
 *
 * @module shared/interceptors/axiosInterceptor
 */

import axios from 'axios';
import { useAuthStore } from '@/shared/stores/auth.store.js';

let isSetup = false;

/**
 * Sets up axios interceptors for authentication
 */
export const setupAxiosInterceptor = () => {
    if (isSetup) {
        return;
    }

    // Request interceptor - Add token to headers
    axios.interceptors.request.use(
        (config) => {
            const authStore = useAuthStore();

            if (authStore.token && authStore.token.accessToken) {
                config.headers.Authorization = `Bearer ${authStore.token.accessToken}`;
            }

            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response interceptor - Handle 401 errors
    axios.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const authStore = useAuthStore();

            // Handle 401 Unauthorized errors
            if (error.response?.status === 401) {
                // Don't redirect if already on auth pages
                const currentPath = window.location.pathname;
                if (currentPath !== '/login' && currentPath !== '/register') {
                    // Clear authentication state
                    await authStore.logout();

                    // Redirect to login page
                    window.location.href = '/login';
                }
            }

            return Promise.reject(error);
        }
    );

    isSetup = true;
};

export default {
    setup: setupAxiosInterceptor
};
