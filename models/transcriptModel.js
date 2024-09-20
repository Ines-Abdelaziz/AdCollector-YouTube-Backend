const pool = require('../db-config');

class TranscriptModel {
    static async getAllTranscripts() {
        try {
            const result = await pool.query('SELECT * FROM transcripts');
            return result.rows;
        } catch (error) {
            throw new Error('Error fetching transcripts from the database');
        }
    }

    static async addTranscript(transcriptData) {
        const { ad_id, transcript } = transcriptData;
        try {
            const existingTranscript = await pool.query('SELECT * FROM transcripts WHERE ad_id = $1', [ad_id]);
            if (existingTranscript.rows.length > 0) {
                throw new Error('Ad transcript with the same ad_id already exists');
            }
    
            const result = await pool.query('INSERT INTO transcripts (ad_id, transcript) VALUES ($1, $2) RETURNING *', [ad_id, transcript]);
            return result.rows[0];
        } catch (error) {
            throw new Error('Error creating ad transcript: ' + error.message);
        }
    }
    static async getTranscriptById(ad_id) {
        try {
            const result = await pool.query('SELECT * FROM transcripts WHERE ad_id = $1', [ad_id]);
            return result.rows[0];
        } catch (error) {
            throw new Error('Error fetching transcript by ID: ' + error.message);
        }
    }
}

module.exports = TranscriptModel;
