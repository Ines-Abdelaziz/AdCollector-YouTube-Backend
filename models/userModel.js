const pool = require("../db-config");

class UserModel {
  static async getAllUsers() {
    try {
      const result = await pool.query("SELECT * FROM users");
      return result.rows;
    } catch (error) {
      throw new Error("Error fetching users from the database");
    }
  }

  static async createUser(userData) {
    const { id, gender, age, country } = userData;
    const videos=0;
    try {
        
      const result = await pool.query(
        "INSERT INTO users (id, gender, age, country,videos) VALUES ($1, $2, $3, $4,$5) RETURNING *",
        [id, gender, age, country,videos]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Error creating user");
    }
  }

  static async getUserById(userId) {
    try {
      const result = await pool.query(
        "SELECT * FROM users WHERE id = $1",
        [userId]
      );
      // Check if any rows were returned
      if (result.rows.length === 0) {
        return null; // Return null if user is not found
      }
      return result.rows[0]; // Return the user if found
    } catch (error) {
      // Log the error, but don't throw it
      console.error("Error fetching user by ID:", error);
      return null; // Return null if there was an error
    }
  }
  static async updateUser(userId, userData) {
    const { gender, age, country } = userData;
    try {
      const result = await pool.query(
        "UPDATE users SET gender = $1, age = $2, country = $3 WHERE id = $4 RETURNING *",
        [gender, age, country, userId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error("Error updating user");
    }
  }

  static async deleteUser(userId) {
    try {
      const result = await pool.query(
        "DELETE FROM users WHERE id = $1 RETURNING *",
        [userId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error("Error deleting user");
    }
  }
  //increment videos watched  by user
  static async incrementVideos(userId) {
    try {
      const result = await pool.query(
        "UPDATE users SET videos = videos + 1 WHERE id = $1 RETURNING *",
        [userId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error("Error incrementing videos watched");
    }
  }
}

module.exports = UserModel;
