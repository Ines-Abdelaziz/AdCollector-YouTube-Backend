const express = require('express');
const router = express.Router();
const UserController = require('./controllers/userController');
const VideoController = require('./controllers/videoController');
const AdController = require('./controllers/adController');
const ChannelController = require('./controllers/channelController');
const UserAdVideoController = require('./controllers/user_ad_videoController');
const AdminController = require('./controllers/adminController');

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
router.post('/ad', AdController.addAd);
router.get('/ad', AdController.getAdByAllColumns);

// Routes for channels
router.get('/channels', ChannelController.getAllChannels);
router.post('/channels', ChannelController.addChannel);
router.get('/channels/:id', ChannelController.getChannelById);

// Routes for user ad video associations
router.post('/user-ad-video', UserAdVideoController.addUserAdVideo);
// Routes for admin
router.post('/admin/register', AdminController.registerAdmin);
router.post('/admin/login', AdminController.loginAdmin);

module.exports = router;
