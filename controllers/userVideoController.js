userVideoModel=require('../models/userVideoModel.js');

class UserVideoController {
    static async addUserVideo(req, res) {
        const userVideoData = req.body;
        try {
            //check if user video exists by comparing all columns
            const userVideo = await userVideoModel.getUserVideoByAllColumns(userVideoData);
            if (userVideo) {
                return res.status(202).json({ error: 'User Video already exists' , user_video_id: userVideo.user_video_id});
            }
            else{
            const newUserVideo = await userVideoModel.addUserVideo(userVideoData);
            res.status(201).json(newUserVideo);}
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

  

    static async getUserVideoByAllColumns(req, res) {
        const userVideoData = req.body;
        try {
            const userVideo = await userVideoModel.getUserVideoByAllColumns(userVideoData);
            if (!userVideo) {
                return res.status(404).json({ error: 'User Video not found' });
            }
            res.json(userVideo.user_video_id);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}