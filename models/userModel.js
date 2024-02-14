const pool = require('../db-config');

class UserModel {
    static async getAllUsers() {
        try {
            const result = await pool.query('SELECT id, gender, age, country FROM users');
            return result.rows;
        } catch (error) {
            throw new Error('Error fetching users from the database');
        }
    }

    static async createUser(userData) {
        const { id, gender, age, country } = userData;
        try {
            const result = await pool.query('INSERT INTO users (id, gender, age, country) VALUES ($1, $2, $3, $4) RETURNING *', [id, gender, age, country]);
            return result.rows[0];
        } catch (error) {
            throw new Error('Error creating user');
        }
    }

    static async getUserById(userId) {
        try {
            const result = await pool.query('SELECT id, gender, age, country FROM users WHERE id = $1', [userId]);
            return result.rows[0];
        } catch (error) {
            throw new Error('Error fetching user by ID');
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
