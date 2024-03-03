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
                    //check if ad exists by comparing all columns
            const ad = await AdModel.getAdByAllColumns(adData);
            if (ad) {
                return res.status(409).json({ error: 'Ad already exists' , ad_id: ad.ad_id});
            }else{
            const newAd = await AdModel.addAd(adData);
            res.status(201).json(newAd);}
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    //get ad by id
    static async getAdById(req, res) {
        const adId = req.params.id;
        try {
            const ad = await AdModel.getAdById(adId);
            if (!ad) {
                return res.status(404).json({ error: 'Ad not found' });
            }
            res.json(ad);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    // get ad by all columns
    static async getAdByAllColumns(req, res) {
        const adData = req.body;
        try {
            const ad = await AdModel.getAdByAllColumns(adData);
            if (!ad) {
                return res.status(404).json({ error: 'Ad not found' });
            }
            res.json(ad.ad_id);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

module.exports = AdController;
