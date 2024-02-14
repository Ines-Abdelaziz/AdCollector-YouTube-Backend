const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const VideoController = require('../controllers/videoController');
const AdController = require('../controllers/adController');
const ChannelController = require('../controllers/channelController');
const UserAdVideoController = require('../controllers/user_ad_videoController');

// Routes for users
router.get('/users', UserController.getAllUsers);
router.post('/users', UserController.createUser);
router.get('/users/:id', UserController.getUserById);
router.put('/users/:id', UserController.updateUser);
router.delete('/users/:id', UserController.deleteUser);

// Routes for videos
router.get('/videos', VideoController.getAllVideos);
router.post('/videos', VideoController.addVideo);
router.get('/videos/:id', VideoController.getVideoById);
router.put('/videos/:id', VideoController.updateVideo);
router.delete('/videos/:id', VideoController.deleteVideo);

// Routes for ads
router.get('/ads', AdController.getAllAds);
router.post('/ads', AdController.addAd);
router.get('/ads/:id', AdController.getAdById);
router.put('/ads/:id', AdController.updateAd);
router.delete('/ads/:id', AdController.deleteAd);

// Routes for channels
router.get('/channels', ChannelController.getAllChannels);
router.post('/channels', ChannelController.addChannel);
router.get('/channels/:id', ChannelController.getChannelById);
router.put('/channels/:id', ChannelController.updateChannel);
router.delete('/channels/:id', ChannelController.deleteChannel);

// Routes for user ad video associations
router.post('/user-ad-video', UserAdVideoController.addUserAdVideo);
// Add other routes for user ad video associations if needed

module.exports = router;
