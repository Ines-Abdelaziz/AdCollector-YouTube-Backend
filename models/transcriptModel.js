const pool = require('../db-config');

class TranscriptModel {
    static async getAllTranscripts() {
        try {
            const result = await pool.query('SELECT * FROM transcript');
            return result.rows;
        } catch (error) {
            throw new Error('Error fetching transcripts from the database');
        }
    }

    static async addTranscript(transcriptData) {
        const { adlink, transcript } = transcriptData;
        try {
            const existingTranscript = await pool.query('SELECT * FROM transcript WHERE adlink = $1', [adlink]);
            if (existingTranscript.rows.length > 0) {
                throw new Error('Ad transcript with the same adlink already exists');
            }
    
            const result = await pool.query('INSERT INTO transcript (adlink, transcript) VALUES ($1, $2) RETURNING *', [adlink, transcript]);
            return result.rows[0];
        } catch (error) {
            throw new Error('Error creating ad transcript: ' + error.message);
        }
    }
    static async getTranscriptById(adlink) {
        try {
            const result = await pool.query('SELECT * FROM transcript WHERE adlink = $1', [adlink]);
            return result.rows[0];
        } catch (error) {
            throw new Error('Error fetching transcript by ID: ' + error.message);
        }
    }
}

module.exports = TranscriptModel;
