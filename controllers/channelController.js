const ChannelModel = require('../models/channelModel');

class ChannelController {
    static async getAllChannels(req, res) {
        try {
            const channels = await ChannelModel.getAllChannels();
            res.json(channels);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async addChannel(req, res) {
        const channelData = req.body;
        try {
            const newChannel = await ChannelModel.addChannel(channelData);
            res.status(201).json(newChannel);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    //get channel by id
    static async getChannelById(req, res) {
        const channelId = req.params.id;
        try {
            const channel = await ChannelModel.getChannelById(channelId);
            if (!channel) {
                return res.status(404).json({ error: 'Channel not found' });
            }
            res.json(channel);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

}

module.exports = ChannelController;
