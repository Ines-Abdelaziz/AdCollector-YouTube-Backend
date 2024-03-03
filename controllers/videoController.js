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
            //check if video exists
            const video = await VideoModel.getVideoById(videoData.video_id);
            if (video) {
                return res.status(409).json({ error: 'Video already exists' });
            }else{
            const newVideo = await VideoModel.addVideo(videoData);
            res.status(201).json(newVideo);}
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    //get video by id
    static async getVideoById(req, res) {
        const videoId = req.params.id;
        try {
            const video = await VideoModel.getVideoById(videoId);
            if (!video) {
                return res.status(404).json({ error: 'Video not found' });
            }
            res.json(video);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Add other route handlers as needed
}

module.exports = VideoController;
