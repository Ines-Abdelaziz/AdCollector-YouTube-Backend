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
        const { video_id, published_at, channel_id, title, description,  made_for_kids, view_count, like_count, comment_count, topic_categories } = videoData;
        const timestamp = new Date();
        try {
            const result = await pool.query('INSERT INTO videos (video_id, published_at, channel_id, title, description,  made_for_kids, view_count, like_count,  comment_count, topic_categories,timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *', [video_id, published_at, channel_id, title, description,  made_for_kids, view_count, like_count,comment_count,topic_categories,timestamp]);
            return result.rows[0];
        } catch (error) {
            console.error('Error creating video:', error);
            throw new Error('Error creating video');
        }
    }
    //get video by id
    static async getVideoById(videoId) {
        try {
            const result = await pool.query('SELECT * FROM videos WHERE video_id = $1', [videoId]);
            return result.rows[0];
        } catch (error) {
            console.error('Error fetching video by ID:', error);
            return null; // Return null if there was an error
        }
    }

}

module.exports = VideoModel;
