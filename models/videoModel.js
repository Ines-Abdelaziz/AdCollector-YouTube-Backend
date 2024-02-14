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
        const { video_id, published_at, channel_id, title, description, region_restriction_allowed, region_restriction_blocked, cnc_rating, csa_rating, yt_rating, made_for_kids, view_count, like_count, dislike_count, favorite_count, comment_count, topic_categories } = videoData;
        try {
            const result = await pool.query('INSERT INTO videos (video_id, published_at, channel_id, title, description, region_restriction_allowed, region_restriction_blocked, cnc_rating, csa_rating, yt_rating, made_for_kids, view_count, like_count, dislike_count, favorite_count, comment_count, topic_categories) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING *', [video_id, published_at, channel_id, title, description, region_restriction_allowed, region_restriction_blocked, cnc_rating, csa_rating, yt_rating, made_for_kids, view_count, like_count, dislike_count, favorite_count, comment_count, topic_categories]);
            return result.rows[0];
        } catch (error) {
            throw new Error('Error creating video');
        }
    }
    //get video by id
    static async getVideoById(videoId) {
        try {
            const result = await pool.query('SELECT * FROM videos WHERE video_id = $1', [videoId]);
            return result.rows[0];
        } catch (error) {
            throw new Error('Error fetching video by ID');
        }
    }

}

module.exports = VideoModel;
