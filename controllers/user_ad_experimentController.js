const UserAdExperimentModel = require('../models/user_ad_experimentModel');


class UserAdExperimentController {
    static async addUserAdExperiment(req, res) {
        const userAdExperimentData = req.body;
        try {
            const newUserAdExperiment = await UserAdExperimentModel.addUserAdExperiment(userAdExperimentData);
            res.status(201).json(newUserAdExperiment);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Add other route handlers as needed
}

module.exports = UserAdExperimentController;
