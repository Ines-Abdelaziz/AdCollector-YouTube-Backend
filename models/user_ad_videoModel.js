const pool = require('../db-config');

class UserAdVideoModel {
    static async addUserAdVideo(userAdVideoData) {
        const { user_id, ad_id, video_id, channel_id } = userAdVideoData;
        try {
            const result = await pool.query('INSERT INTO user_ad_video (user_id, ad_id, video_id,channel_id) VALUES ($1, $2, $3, $4) RETURNING *', [user_id, ad_id, video_id, channel_id]);
            return result.rows[0];
        } catch (error) {
            throw new Error('Error adding user ad video association');
        }
    }

}

module.exports = UserAdVideoModel;
