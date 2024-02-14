const pool = require('../db-config');

class UserModel {
    static async getAllUsers() {
        try {
            const result = await pool.query('SELECT * FROM users');
            return result.rows;
        } catch (error) {
            throw new Error('Error fetching users from the database');
        }
    }

    static async createUser(userData) {
        const { user_id, gender, age, country } = userData;
        try {
            const result = await pool.query('INSERT INTO users (user_id, gender, age, country) VALUES ($1, $2, $3, $4) RETURNING *', [user_id, gender, age, country]);
            return result.rows[0];
        } catch (error) {
            console.error('Error creating user:', error);
            throw new Error('Error creating user');
        }
    }

    static async getUserById(userId) {
        try {
            const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
            // Check if any rows were returned
            if (result.rows.length === 0) {
                return null; // Return null if user is not found
            }
            return result.rows[0]; // Return the user if found
        } catch (error) {
            // Log the error, but don't throw it
            console.error('Error fetching user by ID:', error);
            return null; // Return null if there was an error
        }
    }
    static async updateUser(userId, userData) {
        const { gender, age, country } = userData;
        try {
            const result = await pool.query('UPDATE users SET gender = $1, age = $2, country = $3 WHERE id = $4 RETURNING *', [gender, age, country, userId]);
            return result.rows[0];
        } catch (error) {
            throw new Error('Error updating user');
        }
    }

    static async deleteUser(userId) {
        try {
            const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [userId]);
            return result.rows[0];
        } catch (error) {
            throw new Error('Error deleting user');
        }
    }
}

module.exports = UserModel;
