const AdminModel = require('../models/adminModel');
const bcrypt = require('bcryptjs');
//
const jwt = require('jsonwebtoken');
class AdminController {
    static async registerAdmin(req, res) {
        const { username, password } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
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
            const isPasswordValid = await bcrypt.compare(password, admin.password);
            if (!isPasswordValid) {
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