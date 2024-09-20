const pool = require('../db-config');

class VideoModel {
    static async getAllVideos() {
        try {
            const result = await pool.query('SELECT * FROM videos');
            return result.rows;
        } catch (error) {
            throw new Error('Error fetching videos from the database');
        }
    }

    static async addVideo(videoData) {
        const { id, published_at, channel_id, title, description,  made_for_kids, view_count, like_count, comment_count, topic_categories } = videoData;
        const timestamp = new Date();
        try {
            const result = await pool.query('INSERT INTO videos (id, published_at, channel_id, title, description,  made_for_kids, view_count, like_count,  comment_count, topic_categories) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *', [id, published_at, channel_id, title, description,  made_for_kids, view_count, like_count,comment_count,topic_categories]);
            return result.rows[0];
        } catch (error) {
            console.error('Error creating video:', error);
            throw new Error('Error creating video');
        }
    }
    //get video by id
    static async getVideoById(id) {
        try {
            const result = await pool.query('SELECT * FROM videos WHERE id = $1', [id]);
            return result.rows[0];
        } catch (error) {
            console.error('Error fetching video by ID:', error);
            return null; // Return null if there was an error
        }
    }

}

module.exports = VideoModel;
