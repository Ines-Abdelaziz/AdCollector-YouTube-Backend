const express = require('express');
const router = express.Router();
const UserController = require('./controllers/userController');
const VideoController = require('./controllers/videoController');
const AdController = require('./controllers/adController');
const ChannelController = require('./controllers/channelController');
const UserAdVideoController = require('./controllers/user_ad_videoController');

// Routes for users
router.get('/users', UserController.getAllUsers);
router.post('/users', UserController.createUser);
router.get('/users/:id', UserController.getUserById);
router.delete('/users/:id', UserController.deleteUser);

// Routes for videos
router.get('/videos', VideoController.getAllVideos);
router.post('/videos', VideoController.addVideo);
router.get('/videos/:id', VideoController.getVideoById);

// Routes for ads
router.get('/ads', AdController.getAllAds);
router.post('/ads', AdController.addAd);
router.get('/ads/:id', AdController.getAdById);

// Routes for channels
router.get('/channels', ChannelController.getAllChannels);
router.post('/channels', ChannelController.addChannel);
router.get('/channels/:id', ChannelController.getChannelById);

// Routes for user ad video associations
router.post('/user-ad-video', UserAdVideoController.addUserAdVideo);
// Add other routes for user ad video associations if needed

module.exports = router;
