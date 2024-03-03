const UserAdVideoModel = require('../models/user_ad_videoModel');


class UserAdVideoController {
    static async addUserAdVideo(req, res) {
        const userAdVideoData = req.body;
        try {
            const newUserAdVideo = await UserAdVideoModel.addUserAdVideo(userAdVideoData);
            res.status(201).json(newUserAdVideo);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Add other route handlers as needed
}

module.exports = UserAdVideoController;
