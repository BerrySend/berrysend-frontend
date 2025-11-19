/**
 * Auth Service
 * Handles all API operations related to authentication
 * Uses UserService for user CRUD operations
 *
 * @module modules/auth/services/authService
 */

import {User} from "@/auth/model/user.entity.js";
import {AuthToken} from "@/auth/model/auth-token.entity.js";
import userService from "@/auth/services/user.service.js";

/**
 * Auth Service class for API interactions
 */
class AuthService {
    /**
     * Authenticates a user with email and password
     *
     * @param {string} email - User email address
     * @param {string} password - User password
     * @returns {Promise<Object>} Object containing token and user data
     * @throws {Error} If authentication fails
     */
    async login(email, password) {
        try {
            // Use userService to find user directly from db.json
            const user = await userService.findByEmailAndPassword(email, password);
            
            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Generate mock token
            const token = AuthToken.fromAPI({
                accessToken: `mock_token_${Date.now()}`,
                refreshToken: `mock_refresh_${Date.now()}`,
                expiresIn: 3600,
                tokenType: 'Bearer',
                createdAt: new Date().toISOString()
            });

            return {
                token,
                user
            };
        } catch (error) {
            console.error('Error during login:', error);
            
            if (error.message === 'Invalid email or password') {
                throw error;
            }
            throw new Error('Failed to login. Please try again.');
        }
    }

    /**
     * Registers a new user
     * Uses UserService to create user in db.json directly
     *
     * @param {Object} userData - User registration data
     * @param {string} userData.email - User email address
     * @param {string} userData.password - User password
     * @param {string} userData.name - User full name
     * @returns {Promise<Object>} Object containing token and user data
     * @throws {Error} If registration fails
     */
    async register(userData) {
        try {
            // Use userService to create user directly in db.json
            const user = await userService.create({
                email: userData.email,
                password: userData.password,
                name: userData.name,
                role: 'user'
            });

            // Generate mock token
            const token = AuthToken.fromAPI({
                accessToken: `mock_token_${Date.now()}`,
                refreshToken: `mock_refresh_${Date.now()}`,
                expiresIn: 3600,
                tokenType: 'Bearer',
                createdAt: new Date().toISOString()
            });

            return {
                token,
                user
            };
        } catch (error) {
            console.error('Error during registration:', error);
            
            if (error.message === 'Email already exists') {
                throw error;
            }
            throw new Error('Failed to register. Please try again.');
        }
    }

    /**
     * Logs out the current user
     * Mock implementation - just clears local state
     *
     * @param {string} token - Access token
     * @returns {Promise<void>}
     */
    async logout(token) {
        // Mock implementation - no server call needed
        return Promise.resolve();
    }

    /**
     * Refreshes the access token using refresh token
     * Mock implementation - generates new token
     *
     * @param {string} refreshToken - Refresh token
     * @returns {Promise<AuthToken>} New access token
     */
    async refreshToken(refreshToken) {
        // Mock implementation - just generate new token
        return AuthToken.fromAPI({
            accessToken: `mock_token_${Date.now()}`,
            refreshToken: `mock_refresh_${Date.now()}`,
            expiresIn: 3600,
            tokenType: 'Bearer',
            createdAt: new Date().toISOString()
        });
    }

    /**
     * Gets the current authenticated user
     * Uses UserService to fetch user from db.json
     *
     * @param {string} token - Access token (not used for mock, but kept for API compatibility)
     * @returns {Promise<User>} Current user data
     * @throws {Error} If request fails
     */
    async getCurrentUser(token) {
        try {
            // For mock purposes, get first user from db.json
            // In production, decode token to get user ID
            const users = await userService.getAll();
            if (users.length === 0) {
                throw new Error('Unauthorized');
            }
            return users[0];
        } catch (error) {
            console.error('Error fetching current user:', error);
            
            if (error.message === 'Unauthorized') {
                throw error;
            }
            throw new Error('Failed to fetch user data');
        }
    }

    /**
     * Verifies if a token is valid
     * Mock implementation - always returns true for non-empty tokens
     *
     * @param {string} token - Access token to verify
     * @returns {Promise<boolean>} True if token is valid
     */
    async verifyToken(token) {
        // Mock implementation - just check if token exists
        return Promise.resolve(!!token);
    }
}

// Export singleton instance
export default new AuthService();
