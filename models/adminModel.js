const pool = require('../db-config');



class AdminModel {
    static async registerAdmin(username, hashedPassword) {
        const queryText = 'INSERT INTO admins (username, password) VALUES ($1, $2)';
        await pool.query(queryText, [username, hashedPassword]);
    }
    static async getAdminByUsername(username) {
        const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
        return result.rows[0];
    }
}
module.exports = AdminModel;