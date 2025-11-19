/**
 * Auth Token Model
 * Represents an authentication token (JWT)
 *
 * @module modules/auth/models/auth-token
 */

/**
 * AuthToken entity class
 */
export class AuthToken {
    /**
     * Creates a new AuthToken instance
     *
     * @param {Object} data - Token data
     * @param {string} data.accessToken - JWT access token
     * @param {string} data.refreshToken - JWT refresh token (optional)
     * @param {number} data.expiresIn - Token expiration time in seconds
     * @param {string} data.tokenType - Token type (default: 'Bearer')
     */
    constructor(data = {}) {
        this.accessToken = data.accessToken || data.token || '';
        this.refreshToken = data.refreshToken || '';
        this.expiresIn = data.expiresIn || 3600;
        this.tokenType = data.tokenType || 'Bearer';
        this.createdAt = data.createdAt || new Date().toISOString();
    }

    /**
     * Checks if the token is expired
     *
     * @returns {boolean} True if token is expired
     */
    isExpired() {
        if (!this.accessToken) {
            return true;
        }

        // For mock tokens (non-JWT), use expiresIn and createdAt
        if (!this.accessToken.includes('.')) {
            if (!this.createdAt || !this.expiresIn) {
                return false; // Mock tokens don't expire unless explicitly set
            }
            const expirationTime = new Date(this.createdAt).getTime() + (this.expiresIn * 1000);
            return Date.now() >= expirationTime;
        }

        // For JWT tokens, decode and check exp claim
        try {
            const payload = this.decode();
            if (!payload || !payload.exp) {
                // If no exp claim, check expiresIn
                if (this.createdAt && this.expiresIn) {
                    const expirationTime = new Date(this.createdAt).getTime() + (this.expiresIn * 1000);
                    return Date.now() >= expirationTime;
                }
                return false; // No expiration info, consider valid
            }

            const expirationTime = payload.exp * 1000; // Convert to milliseconds
            return Date.now() >= expirationTime;
        } catch (error) {
            console.error('Error decoding token:', error);
            // If decoding fails but we have expiresIn, use that
            if (this.createdAt && this.expiresIn) {
                const expirationTime = new Date(this.createdAt).getTime() + (this.expiresIn * 1000);
                return Date.now() >= expirationTime;
            }
            return false; // Consider valid if we can't determine expiration
        }
    }

    /**
     * Decodes the JWT token payload
     *
     * @returns {Object|null} Decoded token payload or null if invalid
     */
    decode() {
        if (!this.accessToken) {
            return null;
        }

        try {
            const parts = this.accessToken.split('.');
            if (parts.length !== 3) {
                return null;
            }

            const payload = parts[1];
            const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
            return JSON.parse(decoded);
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }

    /**
     * Gets the token expiration date
     *
     * @returns {Date|null} Expiration date or null if invalid
     */
    getExpirationDate() {
        const payload = this.decode();
        if (!payload || !payload.exp) {
            return null;
        }

        return new Date(payload.exp * 1000);
    }

    /**
     * Gets the time remaining until expiration in milliseconds
     *
     * @returns {number} Time remaining in milliseconds, or 0 if expired
     */
    getTimeRemaining() {
        const expirationDate = this.getExpirationDate();
        if (!expirationDate) {
            return 0;
        }

        const remaining = expirationDate.getTime() - Date.now();
        return remaining > 0 ? remaining : 0;
    }

    /**
     * Converts AuthToken instance to JSON
     *
     * @returns {Object} JSON representation of the token
     */
    toJSON() {
        return {
            accessToken: this.accessToken,
            refreshToken: this.refreshToken,
            expiresIn: this.expiresIn,
            tokenType: this.tokenType,
            createdAt: this.createdAt
        };
    }

    /**
     * Creates an AuthToken instance from API response
     *
     * @param {Object} data - API response data
     * @returns {AuthToken} AuthToken instance
     */
    static fromAPI(data) {
        return new AuthToken({
            accessToken: data.accessToken || data.token || data.access_token,
            refreshToken: data.refreshToken || data.refresh_token,
            expiresIn: data.expiresIn || data.expires_in || 3600,
            tokenType: data.tokenType || data.token_type || 'Bearer'
        });
    }
}
