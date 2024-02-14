const UserModel = require('../models/userModel');

class UserController {
    static async getAllUsers(req, res) {
        try {
            const users = await UserModel.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createUser(req, res) {
        const userData = req.body;
        try {
            const newUser = await UserModel.createUser(userData);
            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getUserById(req, res) {
        const userId = req.params.id;
        try {
            const user = await UserModel.getUserById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateUser(req, res) {
        const userId = req.params.id;
        const userData = req.body;
        try {
            const updatedUser = await UserModel.updateUser(userId, userData);
            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(updatedUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteUser(req, res) {
        const userId = req.params.id;
        try {
            const deletedUser = await UserModel.deleteUser(userId);
            if (!deletedUser) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(deletedUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = UserController;
