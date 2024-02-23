const AdminModel = require('../models/adminModel');
const crypto = require('crypto'); // Import the crypto module

const jwt = require('jsonwebtoken');

class AdminController {
    static async registerAdmin(req, res) {
        const { username, password } = req.body;
        try {
            // Generate a salt
            const salt = crypto.randomBytes(16).toString('hex');
            // Hash the password using the salt
            const hashedPassword = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
            
            await AdminModel.registerAdmin(username, hashedPassword);
            res.status(201).json({ message: 'Admin registered successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async loginAdmin(req, res) {
        const { username, password } = req.body;
        try {
            const admin = await AdminModel.getAdminByUsername(username);
            if (!admin) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }
            // Hash the provided password with the same salt used for registration
            const hashedPassword = crypto.pbkdf2Sync(password, admin.salt, 1000, 64, 'sha512').toString('hex');

            // Compare the hashed passwords
            if (hashedPassword !== admin.password) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }
            const token = jwt.sign({ username: admin.username }, process.env.JWT_SECRET);
            res.json({ token });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = AdminController;
