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
        const { advertiser, advertiser_location, topic, google_information, other_information ,advertiser_link} = adData;
        try {
            const result = await pool.query('INSERT INTO ads ( advertiser, advertiser_location, topic, google_information, other_information,advertiser_link) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [advertiser, advertiser_location, topic, google_information, other_information,advertiser_link]);
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
            console.error('Error fetching ad by ID:', error);
            return null; // Return null if there was an error
        }
    }
    //check id ad existis by comparing all columns of the ad
    static async getAdByAllColumns(adData) {
        const { advertiser, advertiser_location, topic, google_information, other_information ,advertiser_link} = adData;
        try {
            const result = await pool.query('SELECT * FROM ads WHERE advertiser = $1 AND advertiser_location = $2 AND topic = $3 AND google_information = $4 AND other_information = $5 AND advertiser_link = $6', [advertiser, advertiser_location, topic, google_information, other_information,advertiser_link]);
            return result.rows[0];
        } catch (error) {
            console.error('Error fetching ad by ID:', error);
            return null; // Return null if there was an error
        }
    }


}

module.exports = AdModel;
