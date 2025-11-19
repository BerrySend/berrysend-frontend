/**
 * User Model
 * Represents a user in the authentication system
 *
 * @module modules/auth/models/user
 */

/**
 * User entity class
 */
export class User {
    /**
     * Creates a new User instance
     *
     * @param {Object} data - User data
     * @param {string} data.id - Unique identifier
     * @param {string} data.email - User email address
     * @param {string} data.name - User full name
     * @param {string} data.role - User role (optional)
     * @param {string} data.createdAt - Creation timestamp
     */
    constructor(data = {}) {
        this.id = data.id || null;
        this.email = data.email || '';
        this.name = data.name || '';
        this.role = data.role || 'user';
        this.createdAt = data.createdAt || new Date().toISOString();
    }

    /**
     * Validates if the user data is complete and valid
     *
     * @returns {Object} Validation result with isValid flag and errors array
     */
    validate() {
        const errors = [];

        if (!this.email || this.email.trim().length === 0) {
            errors.push('Email is required');
        } else if (!this.isValidEmail(this.email)) {
            errors.push('Email format is invalid');
        }

        if (!this.name || this.name.trim().length === 0) {
            errors.push('Name is required');
        } else if (this.name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Validates email format
     *
     * @param {string} email - Email to validate
     * @returns {boolean} True if email is valid
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Converts User instance to JSON
     *
     * @returns {Object} JSON representation of the user
     */
    toJSON() {
        return {
            id: this.id,
            email: this.email,
            name: this.name,
            role: this.role,
            createdAt: this.createdAt
        };
    }

    /**
     * Creates a User instance from API response
     *
     * @param {Object} data - API response data
     * @returns {User} User instance
     */
    static fromAPI(data) {
        return new User({
            id: data.id,
            email: data.email,
            name: data.name || data.fullName,
            role: data.role || 'user',
            createdAt: data.createdAt
        });
    }

    /**
     * Creates an array of User instances from API response
     *
     * @param {Array} dataArray - Array of API response data
     * @returns {Array<User>} Array of User instances
     */
    static fromAPIArray(dataArray) {
        if (!Array.isArray(dataArray)) {
            return [];
        }
        return dataArray.map(data => User.fromAPI(data));
    }
}
