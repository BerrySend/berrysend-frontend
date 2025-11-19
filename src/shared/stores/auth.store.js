/**
 * Auth Store
 * Pinia store for managing authentication state
 *
 * @module shared/stores/authStore
 */

import {defineStore} from 'pinia';
import {computed, ref} from 'vue';
import authService from "@/auth/services/auth.service.js";
import {User} from "@/auth/model/user.entity.js";
import {AuthToken} from "@/auth/model/auth-token.entity.js";

const TOKEN_STORAGE_KEY = 'berrysend_token';
const USER_STORAGE_KEY = 'berrysend_user';

/**
 * Auth store definition
 */
export const useAuthStore = defineStore('auth', () => {
    // State
    const token = ref(null);
    const user = ref(null);
    const loading = ref(false);
    const error = ref(null);

    // Getters
    const isAuthenticated = computed(() => {
        if (!token.value) {
            return false;
        }

        // Check if token is expired
        if (token.value.isExpired()) {
            logout();
            return false;
        }

        return true;
    });

    const userRole = computed(() => {
        return user.value?.role || 'user';
    });

    /**
     * Initializes the store from localStorage
     */
    const initialize = () => {
        try {
            const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
            const storedUser = localStorage.getItem(USER_STORAGE_KEY);

            if (storedToken) {
                const tokenData = JSON.parse(storedToken);
                token.value = new AuthToken(tokenData);

                // Check if token is expired
                if (token.value.isExpired()) {
                    clearStorage();
                    return;
                }
            }

            if (storedUser) {
                const userData = JSON.parse(storedUser);
                user.value = new User(userData);
            }
        } catch (error) {
            console.error('Error initializing auth store:', error);
            clearStorage();
        }
    }

    /**
     * Saves token and user to localStorage
     */
    const saveToStorage = () => {
        if (token.value) {
            localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(token.value.toJSON()));
        }

        if (user.value) {
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user.value.toJSON()));
        }
    }

    /**
     * Clears token and user from localStorage
     */
    const clearStorage = () => {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
    }

    /**
     * Logs in a user
     *
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<void>}
     */
    const login = async (email, password) => {
        loading.value = true;
        error.value = null;

        try {
            const result = await authService.login(email, password);

            token.value = result.token;
            user.value = result.user;

            saveToStorage();

            return result;
        } catch (err) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    }

    /**
     * Registers a new user
     *
     * @param {Object} userData - User registration data
     * @param {string} userData.email - User email
     * @param {string} userData.password - User password
     * @param {string} userData.name - User name
     * @returns {Promise<void>}
     */
    const register = async (userData) => {
        loading.value = true;
        error.value = null;

        try {
            const result = await authService.register(userData);

            token.value = result.token;
            user.value = result.user;

            saveToStorage();

            return result;
        } catch (err) {
            error.value = err.message;
            throw err;
        } finally {
            loading.value = false;
        }
    }

    /**
     * Logs out the current user
     */
    const logout = async () => {
        loading.value = true;

        try {
            if (token.value) {
                await authService.logout(token.value.accessToken);
            }
        } catch (err) {
            console.error('Error during logout:', err);
        } finally {
            token.value = null;
            user.value = null;
            error.value = null;

            clearStorage();
            loading.value = false;
        }
    }

    /**
     * Refreshes the access token
     *
     * @returns {Promise<void>}
     */
    const refreshToken = async () => {
        if (!token.value?.refreshToken) {
            throw new Error('No refresh token available');
        }

        try {
            token.value = await authService.refreshToken(token.value.refreshToken);
            saveToStorage();
        } catch (err) {
            console.error('Error refreshing token:', err);
            logout();
            throw err;
        }
    }

    /**
     * Fetches the current user data
     *
     * @returns {Promise<void>}
     */
    const fetchCurrentUser = async () => {
        if (!token.value) {
            throw new Error('No token available');
        }

        loading.value = true;
        error.value = null;

        try {
            user.value = await authService.getCurrentUser(token.value.accessToken);
            saveToStorage();
        } catch (err) {
            error.value = err.message;
            
            // If unauthorized, logout
            if (err.message === 'Unauthorized') {
                logout();
            }
            
            throw err;
        } finally {
            loading.value = false;
        }
    }

    /**
     * Clears error message
     */
    const clearError = () => {
        error.value = null;
    }

    return {
        // State
        token,
        user,
        loading,
        error,

        // Getters
        isAuthenticated,
        userRole,

        // Actions
        initialize,
        login,
        register,
        logout,
        refreshToken,
        fetchCurrentUser,
        clearError
    };
});
