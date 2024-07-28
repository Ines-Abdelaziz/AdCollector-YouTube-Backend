const UserAdExperimentModel = require('../models/user_ad_experimentModel');


class UserAdExperimentController {
    static async addUserAdExperiment(req, res) {
        const userAdVideoData = req.body;
        try {
            const newUserAdVideo = await UserAdExperimentModel.addUserAdExperiment(userAdVideoData);
            res.status(201).json(newUserAdVideo);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Add other route handlers as needed
}

module.exports = UserAdExperimentController;
