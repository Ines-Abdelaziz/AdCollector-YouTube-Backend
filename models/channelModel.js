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
        const { id, title, description, keywords, country, view_count, subscriber_count,video_count } = channelData;
        console.log('channelData:', channelData);
    

        try {
            const result = await pool.query('INSERT INTO channels (id, title, description, keywords, country,  view_count, subscriber_count,video_count) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [id, title, description, keywords, country, view_count, subscriber_count,video_count]);
            return result.rows[0];
        } catch (error) {
            console.log(error);
            throw new Error('Error creating channel');
        }ß
    }
    // get channel by id
    static async getChannelById(channelId) {
        try {
            const result = await pool.query('SELECT * FROM channels WHERE id = $1', [channelId]);
            return result.rows[0];
        } catch (error) {
            console.error('Error fetching channel by ID:', error);
            return null; // Return null if there was an error
        }
    }

}

module.exports = ChannelModel;
