const pool = require('../db-config');

class transcriptModel {
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
            // Check if the adlink already exists in the table
            const existingTranscript = await pool.query('SELECT * FROM transcript WHERE adlink = $1', [adlink]);
            if (existingTranscript.rows.length > 0) {
                throw new Error('Ad transcript with the same adlink already exists');
            }
    
            // If the adlink doesn't exist, insert the new transcript
            const result = await pool.query('INSERT INTO transcript (adlink, transcript) VALUES ($1, $2) RETURNING *', [adlink, transcript]);
            return result.rows[0];
        } catch (error) {
            throw new Error('Error creating ad transcript: ' + error.message);
        }
    }
    
    //get ad by id
    static async getTranscriptById(adlink) {
        try {
            const result = await pool.query('SELECT * FROM transcript WHERE adlink = $1', [adlink]);
            return result.rows[0];
        } catch (error) {
            console.error('Error fetching transcript by ID:', error);
            return null; // Return null if there was an error
        }
    }


}

module.exports = transcriptModel;
