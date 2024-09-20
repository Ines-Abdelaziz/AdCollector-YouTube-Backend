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
    static async getAllAdsshown() {
        try {
            const result = await pool.query(`
                SELECT ads.*, ad_user.*, videos.*
                FROM ads
                JOIN ad_user ON ads.id = ad_user.ad_id
                JOIN videos ON ad_user.video_id = videos.id
            `);
            return result.rows;
        } catch (error) {
            console.error('Database error:', error.message); // Add better error logging
            throw new Error('Error fetching ads from the database');
        }
    }
    
    static async addAd(adData) {
        const { id,advertiser, advertiser_location, topic ,advertiser_link,brand} = adData;
        try {
            const result = await pool.query('INSERT INTO ads ( id,advertiser, advertiser_location, topic,advertiser_link,brand) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [id,advertiser, advertiser_location, topic,advertiser_link,brand]);
            return result.rows[0];
        } catch (error) {
            throw new Error('Error creating ad');
        }
    }
    //get ad by id
    static async getAdById(id) {
        try {
            const result = await pool.query('SELECT * FROM ads WHERE ad_id = $1', [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error fetching ad by ID:', error);
            return null; // Return null if there was an error
        }
    }
    //check id ad existis by comparing all columns of the ad
    static async getAdByAllColumns(adData) {
        const {id,advertiser, advertiser_location, topic ,advertiser_link,brand} = adData;
        try {
            const result = await pool.query('SELECT * FROM ads WHERE id = $1 AND advertiser = $2 AND advertiser_location = $3 AND topic = $4  AND advertiser_link = $5 AND brand = $6 ', [id,advertiser, advertiser_location, topic,advertiser_link,brand]);
            return result.rows[0];
        } catch (error) {
            console.error('Error fetching ad by ID:', error);
            return null; // Return null if there was an error
        }
    }


}

module.exports = AdModel;
