const express = require("express");
const router = express.Router();
const UserController = require("./controllers/userController");
const VideoController = require("./controllers/videoController");
const AdController = require("./controllers/adController");
const ChannelController = require("./controllers/channelController");
const UserAdVideoController = require("./controllers/user_ad_videoController");
const AdminController = require("./controllers/adminController");
const UserStatsController = require("./controllers/user_statsController");
const UserVideoController = require("./controllers/userVideoController");
const TranscriptController = require("./controllers/transcriptController");


// Routes for users
router.get("/users", UserController.getAllUsers);
router.post("/user", UserController.createUser);
router.get("/users/:id", UserController.getUserById);
router.delete("/users/:id", UserController.deleteUser);

router.post("/user/authenticate", UserController.authenticateUser);

// Routes for videos
router.get("/videos", VideoController.getAllVideos);
router.post("/video", VideoController.addVideo);
router.get("/videos/:id", VideoController.getVideoById);

// Routes for ads
router.get("/ads", AdController.getAllAds);
router.get("/adsshown", AdController.getAllAdsshown);
router.post("/ad", AdController.addAd);
router.get("/ad", AdController.getAdByAllColumns);

// Routes for channels
router.get("/channels", ChannelController.getAllChannels);
router.post("/channel", ChannelController.addChannel);
router.get("/channels/:id", ChannelController.getChannelById);

// Routes for user ad video associations
router.post("/user-ad-video", UserAdVideoController.addUserAdVideo);
//routes for posting watch history
router.post("/watch-history",UserVideoController.addUserVideo); 
//Routes for getting stats of user
router.get("/user-stats/ads/:userId", UserStatsController.getAdsByUser);
router.get(
  "/user-stats/nbads/:userId",
  UserStatsController.getAdsCollectedByUser
);
router.get(
  "/user-stats/nbvids/:userId",
  UserStatsController.getVidsWatchedByUser
);
router.get(
  "/user-stats/topics/:userId",
  UserStatsController.getTopicsOccurenceByUser
);
router.get(
  "/user-stats/top-advertisers/:userId",
  UserStatsController.getTopAdvertisersByUser
);
router.get(
  "/user-stats/targeting-reasons/:userId",
  UserStatsController.getTargetingReasonsByUser
);
router.get(
  "/user-stats/google-targeting-reasons/:userId",
  UserStatsController.getGoogleTargetingReasonsByUser
);

router.get(
  "/user-stats/targeting-strategies/:userId",
  UserStatsController.getTargetingStartegies
);
router.get(
  "/user-stats/targeting-combinations/:userId",
  UserStatsController.getTargetingCombinations
);

router.get(
  "/user-stats/count-political/:userId",
  UserStatsController.getCountPoliticalsAd
);
router.get("/user-stats/political/:userId", UserStatsController.getPolticalAds);
router.get(
  "/user-stats/political-placement/:userId",
  UserStatsController.getPolticalPlacmentAds
);

router.get(
  "/user-stats/placement-pervideo/:userId",
  UserStatsController.getPlacmentBasedPerVideo
);

router.post("/increment-watch-count", UserController.incrementVideos);

// Routes for admin
router.post("/admin/register", AdminController.registerAdmin);
router.post("/admin/login", AdminController.loginAdmin);
router.get("/admin/ads", AdminController.getAds);
router.get(
  "/nbads/",
  AdminController.getAdsCollected
);
router.get(
  "/nbvids/",
  AdminController.getVidsWatched
);
router.get(
  "/topics/",
  AdminController.getTopicsOccurence
);
router.get(
  "/top-advertisers/",
  AdminController.getTopAdvertisers
);
router.get(
  "/targeting-reasons/",
  AdminController.getTargetingReasons
);
router.get(
  "/google-targeting-reasons/",
  AdminController.getGoogleTargetingReasons
);

router.get(
  "/targeting-strategies/",
  AdminController.getTargetingStartegies
);
router.get(
  "/targeting-combinations/",
  AdminController.getTargetingCombinations
);

router.get(
  "/count-political/",
  AdminController.getCountPoliticalsAd
);
router.get("/political/", AdminController.getPoliticalAds);
router.get(
  "/political-placement/",
  AdminController.getPolticalPlacmentAds
);

router.get(
  "/placement-pervideo",
  AdminController.getPlacmentBasedPerVideo
);

// Routes for transcripts
router.get("/transcripts", TranscriptController.getAllTranscripts);
router.post("/transcript", TranscriptController.addTranscript);
router.get("/transcripts/:adlink", TranscriptController.getTranscriptById);


module.exports = router;
