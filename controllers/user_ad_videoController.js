const UserAdVideoModel = require('../models/user_ad_videoModel');
const UserModel = require('../models/userModel');
const VideoModel = require('../models/videoModel');
const AdModel = require('../models/adModel');
const ChannelModel = require('../models/channelModel');

class UserAdVideoController {
    static async addUserAdVideo(req, res) {
        const userAdVideoData = req.body;
        const { user_id, ad_id, video_id } = userAdVideoData;

        try {
            // Check if user exists, if not, create it
            let user = await UserModel.getUserById(user_id);
            if (!user) {
                user = await UserModel.createUser({ id: user_id });
            }

            // Check if ad exists, if not, create it
            let ad = await AdModel.getAdById(ad_id);
            if (!ad) {
                ad = await AdModel.createAd({ ad_id });
            }

            // Check if video exists, if not, create it
            let video = await VideoModel.getVideoById(video_id);
            if (!video) {
                video = await VideoModel.addVideo({ video_id });
            }

            //  check if the channel exists and create it if necessary
             let channel = await ChannelModel.getChannelById(video.channel_id);
            if (!channel) {
               channel = await ChannelModel.addChannel({ id: video.channel_id });
             }

            // Now that all entities exist, add the association
            const newUserAdVideo = await UserAdVideoModel.addUserAdVideo(userAdVideoData);
            res.status(201).json(newUserAdVideo);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Add other route handlers as needed
}

module.exports = UserAdVideoController;
