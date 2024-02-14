const VideoModel = require('../models/videoModel');

class VideoController {
    static async getAllVideos(req, res) {
        try {
            const videos = await VideoModel.getAllVideos();
            res.json(videos);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async addVideo(req, res) {
        const videoData = req.body;
        try {
            const newVideo = await VideoModel.addVideo(videoData);
            res.status(201).json(newVideo);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Add other route handlers as needed
}

module.exports = VideoController;
