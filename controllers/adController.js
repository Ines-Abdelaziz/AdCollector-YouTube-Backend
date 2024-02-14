const AdModel = require('../models/adModel');

class AdController {
    static async getAllAds(req, res) {
        try {
            const ads = await AdModel.getAllAds();
            res.json(ads);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async addAd(req, res) {
        const adData = req.body;
        try {
            const newAd = await AdModel.addAd(adData);
            res.status(201).json(newAd);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

module.exports = AdController;
