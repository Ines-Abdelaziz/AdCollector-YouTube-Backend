const UserAdVideoModel = require("../models/user_ad_videoModel");

class UserAdVideoController {
  static async addUserAdVideo(req, res) {
    const userAdVideoData = req.body;
    try {
      const newUserAdVideo = await UserAdVideoModel.addUserAdVideo(
        userAdVideoData
      );
      res.status(201).json(newUserAdVideo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async addUserAd(req, res) {
    const userAdVideoData = req.body;
    try {
      const newUserAdVideo = await UserAdVideoModel.addUserAd(userAdVideoData);
      res.status(201).json(newUserAdVideo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UserAdVideoController;
