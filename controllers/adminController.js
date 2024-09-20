const AdminModel = require('../models/adminModel');
const argon2 = require('argon2'); // Import argon2 library
//
const jwt = require('jsonwebtoken');

class AdminController {
    static async registerAdmin(req, res) {
        const { username, password } = req.body;
        try {
            const hashedPassword = await argon2.hash(password); // Hash password with argon2
            await AdminModel.registerAdmin(username, hashedPassword);
            res.status(201).json({ message: 'Admin registered successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async loginAdmin(req, res) {
        const { username, password } = req.body;
        try {
            const admin = await AdminModel.getAdminByUsername(username);
            if (!admin) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }
            const isPasswordValid = await argon2.verify(admin.password, password); // Verify password with argon2
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid username or password' });
            }
            const token = jwt.sign({ username: admin.username }, process.env.JWT_SECRET);
            res.json({ token });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getAds(req, res) {
        try {
          const ads = await AdminModel.getAds();
          res.status(200).json({ ads });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
      static async getAdsCollected(req, res) {
        try {
          const adsCollected = await AdminModel.getAdsCollected();
          res.status(200).json({ adsCollected });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
      static async getVidsWatched(req, res) {
        try {
          const VidsWatched = await AdminModel.getVidsWatched();
          res.status(200).json({ VidsWatched });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
    
      static async getTopicsOccurence(req, res) {
        try {
          const topicsOccurence = await AdminModel.getTopicsOccurence(
          );
          res.status(200).json({ topicsOccurence });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
      static async getTopAdvertisers(req, res) {
        try {
          const topAdvertisers = await AdminModel.getTopAdvertisers(
          );
          res.status(200).json({ topAdvertisers });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
      //get targeeting reasons by user
      static async getTargetingReasons(req, res) {
        try {
          const targetingReasons = await AdminModel.getTargetingReasons(
          );
          res.status(200).json({ targetingReasons });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
      static async getGoogleTargetingReasons(req, res) {
        try {
          const targetingReasons =
            await AdminModel.getGoogleTargetingReasons();
          res.status(200).json({ targetingReasons });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
    
      ////////////
    
      static async getTargetingStartegies(req, res) {
        try {
          const result = await AdminModel.getTargetingStartegies();
          res.status(200).json({ result });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
      static async getTargetingCombinations(req, res) {
        try {
          const result = await AdminModel.getTargetingCombinations();
          res.status(200).json({ result });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
    
      static async getCountPoliticalsAd(req, res) {
        try {
          const result = await AdminModel.getCountPoliticalsAd();
          res.status(200).json({ result });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
      static async getPolticalAds(req, res) {
        try {
          const result = await AdminModel.getPolticalAds();
          res.status(200).json({ result });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
      static async getPolticalPlacmentAds(req, res) {
        try {
          const result = await AdminModel.getPolticalPlacmentAds();
          res.status(200).json({ result });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      }
}

module.exports = AdminController;
