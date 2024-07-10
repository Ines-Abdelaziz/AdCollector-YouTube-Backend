const UserStatsModel = require("../models/user_statsModel");

class UserStatsController {
  static async getAdsCollectedByUser(req, res) {
    const userId = req.params.userId;
    try {
      const adsCollected = await UserStatsModel.getAdsCollectedByUser(userId);
      res.status(200).json({ adsCollected });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getTopicsOccurenceByUser(req, res) {
    const userId = req.params.userId;
    try {
      const topicsOccurence = await UserStatsModel.getTopicsOccurenceByUser(
        userId
      );
      res.status(200).json({ topicsOccurence });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async getTopAdvertisersByUser(req, res) {
    const userId = req.params.userId;
    try {
      const topAdvertisers = await UserStatsModel.getTopAdvertisersByUser(
        userId
      );
      res.status(200).json({ topAdvertisers });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  //get targeeting reasons by user
  static async getTargetingReasonsByUser(req, res) {
    const userId = req.params.userId;
    try {
      const targetingReasons = await UserStatsModel.getTargetingReasonsByUser(
        userId
      );
      res.status(200).json({ targetingReasons });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async getGoogleTargetingReasonsByUser(req, res) {
    const userId = req.params.userId;
    try {
      const targetingReasons =
        await UserStatsModel.getGoogleTargetingReasonsByUser(userId);
      res.status(200).json({ targetingReasons });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
module.exports = UserStatsController;
