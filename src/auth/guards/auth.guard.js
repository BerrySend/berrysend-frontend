/**
 * Auth Guard
 * Navigation guards for protecting routes that require authentication
 *
 * @module modules/auth/guards/authGuard
 */

import { useAuthStore } from '@/shared/stores/auth.store.js';

/**
 * Checks if user is authenticated
 *
 * @returns {boolean} True if user is authenticated
 */
export const isAuthenticated = () => {
    const authStore = useAuthStore();
    return authStore.isAuthenticated;
};

/**
 * Navigation guard for protected routes
 * Redirects to login if user is not authenticated
 *
 * @param {Object} to - Target route
 * @param {Object} from - Source route
 * @param {Function} next - Next function
 */
export const requireAuth = (to, from, next) => {
    const authStore = useAuthStore();

    // Initialize store from localStorage
    if (!authStore.token) {
        authStore.initialize();
    }

    if (authStore.isAuthenticated) {
        next();
    } else {
        next({
            path: '/login',
            query: { redirect: to.fullPath }
        });
    }
};

/**
 * Navigation guard for auth routes (login/register)
 * Redirects to home if user is already authenticated
 *
 * @param {Object} to - Target route
 * @param {Object} from - Source route
 * @param {Function} next - Next function
 */
export const requireGuest = (to, from, next) => {
    const authStore = useAuthStore();

    // Initialize store from localStorage
    if (!authStore.token) {
        authStore.initialize();
    }

    if (authStore.isAuthenticated) {
        next('/management');
    } else {
        next();
    }
};
