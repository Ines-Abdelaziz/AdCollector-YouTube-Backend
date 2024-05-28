const TranscriptModel = require('../models/transcriptModel');

class TranscriptController {
    static async getAllTranscripts(req, res) {
        try {
            const transcripts = await TranscriptModel.getAllTranscripts();
            res.json(transcripts);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async addTranscript(req, res) {
        const transcriptData = req.body;
        
        try {
            const newTranscript = await TranscriptModel.addTranscript(transcriptData);
            res.status(201).json(newTranscript);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getTranscriptById(req, res) {
        const adlink = req.params.adlink;
        try {
            const transcript = await TranscriptModel.getTranscriptById(adlink);
            if (!transcript) {
                return res.status(404).json({ error: 'Transcript not found' });
            }
            res.json(transcript);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = TranscriptController;
