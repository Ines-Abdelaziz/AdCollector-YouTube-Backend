const UserStatsModel = require("../models/user_statsModel");

class UserStatsController {
  static async getAdsByUser(req, res) {
    const userId = req.params.userId;
    try {
      const ads = await UserStatsModel.getAdsByUser(userId);
      res.status(200).json({ ads });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async getAdsCollectedByUser(req, res) {
    const userId = req.params.userId;
    try {
      const adsCollected = await UserStatsModel.getAdsCollectedByUser(userId);
      res.status(200).json({ adsCollected });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async getVidsWatchedByUser(req, res) {
    const userId = req.params.userId;
    try {
      const VidsWatched = await UserStatsModel.getVidsWatchedByUser(userId);
      res.status(200).json({ VidsWatched });
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

  ////////////

  static async getTargetingStartegies(req, res) {
    const userId = req.params.userId;
    try {
      const result = await UserStatsModel.getTargetingStartegies(userId);
      res.status(200).json({ result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async getTargetingCombinations(req, res) {
    const userId = req.params.userId;
    try {
      const result = await UserStatsModel.getTargetingCombinations(userId);
      res.status(200).json({ result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async getPlacmentBasedPerVideo(req, res) {
    const userId = req.params.userId;
    try {
      const result = await UserStatsModel.getPlacmentBasedPerVideo(userId);
      res.status(200).json({ result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async getCountPoliticalsAd(req, res) {
    const userId = req.params.userId;
    try {
      const result = await UserStatsModel.getCountPoliticalsAd(userId);
      res.status(200).json({ result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async getPolticalAds(req, res) {
    const userId = req.params.userId;
    try {
      const result = await UserStatsModel.getPolticalAds(userId);
      res.status(200).json({ result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async getPolticalPlacmentAds(req, res) {
    const userId = req.params.userId;
    try {
      const result = await UserStatsModel.getPolticalPlacmentAds(userId);
      res.status(200).json({ result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}
module.exports = UserStatsController;
