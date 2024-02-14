const pool = require('../db-config');

class ChannelModel {
    static async getAllChannels() {
        try {
            const result = await pool.query('SELECT * FROM channels');
            return result.rows;
        } catch (error) {
            throw new Error('Error fetching channels from the database');
        }
    }

    static async addChannel(channelData) {
        const { id, title, description, keywords, topicCategories, madeForKids, defaultLanguage, country, viewCount, subscriberCount, hiddenSubscriberCount, videoCount } = channelData;
        try {
            const result = await pool.query('INSERT INTO channels (id, title, description, keywords, topic_categories, made_for_kids, default_language, country, view_count, subscriber_count, hidden_subscriber_count, video_count) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *', [id, title, description, keywords, topicCategories, madeForKids, defaultLanguage, country, viewCount, subscriberCount, hiddenSubscriberCount, videoCount]);
            return result.rows[0];
        } catch (error) {
            throw new Error('Error creating channel');
        }
    }
    // get channel by id
    static async getChannelById(channelId) {
        try {
            const result = await pool.query('SELECT * FROM channels WHERE id = $1', [channelId]);
            return result.rows[0];
        } catch (error) {
            throw new Error('Error fetching channel by ID');
        }
    }

}

module.exports = ChannelModel;
