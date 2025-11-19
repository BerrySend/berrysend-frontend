/**
 * User Service
 * Handles all CRUD operations related to users using db.json via REST API
 *
 * @module modules/auth/services/userService
 */

import axios from 'axios';
import {User} from "@/auth/model/user.entity.js";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const USER_ENDPOINT_PATH = import.meta.env.VITE_USER_ENDPOINT_PATH || '/users';

/**
 * User Service class for user CRUD operations
 */
class UserService {
    /**
     * Finds a user by email
     *
     * @param {string} email - User email address
     * @returns {Promise<User|null>} User instance or null if not found
     * @throws {Error} If request fails
     */
    async findByEmail(email) {
        try {
            const response = await axios.get(`${API_BASE_URL}${USER_ENDPOINT_PATH}`, {
                params: { email }
            });

            const users = response.data;
            if (!users || users.length === 0) {
                return null;
            }

            return User.fromAPI(users[0]);
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw new Error('Failed to find user');
        }
    }

    /**
     * Finds a user by email and password
     *
     * @param {string} email - User email address
     * @param {string} password - User password
     * @returns {Promise<User|null>} User instance or null if not found
     * @throws {Error} If request fails
     */
    async findByEmailAndPassword(email, password) {
        try {
            const response = await axios.get(`${API_BASE_URL}${USER_ENDPOINT_PATH}`, {
                params: { email, password }
            });

            const users = response.data;
            if (!users || users.length === 0) {
                return null;
            }

            return User.fromAPI(users[0]);
        } catch (error) {
            console.error('Error finding user by email and password:', error);
            throw new Error('Failed to find user');
        }
    }

    /**
     * Gets a user by ID
     *
     * @param {string} id - User ID
     * @returns {Promise<User>} User instance
     * @throws {Error} If user not found or request fails
     */
    async getById(id) {
        try {
            const response = await axios.get(`${API_BASE_URL}${USER_ENDPOINT_PATH}/${id}`);
            return User.fromAPI(response.data);
        } catch (error) {
            console.error('Error getting user by ID:', error);
            
            if (error.response?.status === 404) {
                throw new Error('User not found');
            }
            throw new Error('Failed to get user');
        }
    }

    /**
     * Creates a new user
     *
     * @param {Object} userData - User data
     * @param {string} userData.email - User email address
     * @param {string} userData.password - User password
     * @param {string} userData.name - User full name
     * @param {string} [userData.role] - User role (default: 'user')
     * @returns {Promise<User>} Created user instance
     * @throws {Error} If user creation fails
     */
    async create(userData) {
        try {
            // Check if user already exists
            const existingUser = await this.findByEmail(userData.email);
            if (existingUser) {
                throw new Error('Email already exists');
            }

            const newUserData = {
                email: userData.email,
                password: userData.password,
                name: userData.name,
                role: userData.role || 'user',
                createdAt: new Date().toISOString()
            };

            const response = await axios.post(`${API_BASE_URL}${USER_ENDPOINT_PATH}`, newUserData);
            return User.fromAPI(response.data);
        } catch (error) {
            console.error('Error creating user:', error);
            
            if (error.message === 'Email already exists') {
                throw error;
            }
            throw new Error('Failed to create user');
        }
    }

    /**
     * Updates a user
     *
     * @param {string} id - User ID
     * @param {Object} userData - Updated user data
     * @returns {Promise<User>} Updated user instance
     * @throws {Error} If update fails
     */
    async update(id, userData) {
        try {
            const response = await axios.put(`${API_BASE_URL}${USER_ENDPOINT_PATH}/${id}`, userData);
            return User.fromAPI(response.data);
        } catch (error) {
            console.error('Error updating user:', error);
            
            if (error.response?.status === 404) {
                throw new Error('User not found');
            }
            throw new Error('Failed to update user');
        }
    }

    /**
     * Deletes a user
     *
     * @param {string} id - User ID
     * @returns {Promise<void>}
     * @throws {Error} If deletion fails
     */
    async delete(id) {
        try {
            await axios.delete(`${API_BASE_URL}${USER_ENDPOINT_PATH}/${id}`);
        } catch (error) {
            console.error('Error deleting user:', error);
            
            if (error.response?.status === 404) {
                throw new Error('User not found');
            }
            throw new Error('Failed to delete user');
        }
    }

    /**
     * Gets all users
     *
     * @returns {Promise<Array<User>>} Array of user instances
     * @throws {Error} If request fails
     */
    async getAll() {
        try {
            const response = await axios.get(`${API_BASE_URL}${USER_ENDPOINT_PATH}`);
            return User.fromAPIArray(response.data);
        } catch (error) {
            console.error('Error getting all users:', error);
            throw new Error('Failed to get users');
        }
    }
}

// Export singleton instance
export default new UserService();

