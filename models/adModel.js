const pool = require('../db-config');

class AdModel {
    static async getAllAds() {
        try {
            const result = await pool.query('SELECT * FROM ads');
            return result.rows;
        } catch (error) {
            throw new Error('Error fetching ads from the database');
        }
    }

    static async addAd(adData) {
        const { ad_id, advertiser, advertiser_location, topic, google_information, other_information } = adData;
        try {
            const result = await pool.query('INSERT INTO ads (ad_id, advertiser, advertiser_location, topic, google_information, other_information) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [ad_id, advertiser, advertiser_location, topic, google_information, other_information]);
            return result.rows[0];
        } catch (error) {
            throw new Error('Error creating ad');
        }
    }
    //get ad by id
    static async getAdById(adId) {
        try {
            const result = await pool.query('SELECT * FROM ads WHERE ad_id = $1', [adId]);
            return result.rows[0];
        } catch (error) {
            throw new Error('Error fetching ad by ID');
        }
    }


}

module.exports = AdModel;
