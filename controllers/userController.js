const { response } = require("express");
const UserModel = require("../models/userModel");
const axios = require('axios');

class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await UserModel.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createUser(req, res) {
    const userData = req.body;
    try {
      //check if user exists
      
      const user = await UserModel.getUserById(userData.id);
      if (user) {
        return res.status(409).json({ error: "User already exists" });
      } else {
        const newUser = await UserModel.createUser(userData);
        res.status(201).json(newUser);
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getUserById(req, res) {
    const userId = req.params.id;
    try {
      const user = await UserModel.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateUser(req, res) {
    const userId = req.params.id;
    const userData = req.body;
    try {
      const updatedUser = await UserModel.updateUser(userId, userData);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteUser(req, res) {
    const userId = req.params.id;
    try {
      const deletedUser = await UserModel.deleteUser(userId);
      if (!deletedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(deletedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  //increment videos
  static async incrementVideos(req, res) {
    const { userId } = req.body;
    try {
      const updatedUser = await UserModel.incrementVideos(userId);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  //authenticate user
  static async authenticateUser(req, res) {
    const CLIENT_ID =
      "852662586348-50t7sehl92p5m9vkb97rnggbcp5pvvgh.apps.googleusercontent.com";

    const { token, userId } = req.body;
    const url='https://www.googleapis.com/oauth2/v1/tokeninfo?access_token='+token;
  const data=await validatetoken(url)
    if (data.issued_to === CLIENT_ID &&
         data.user_id === userId){
        return res.status(200).json({ success: true });
    }else
    {
        return res.status(401).json({ success:false ,error: "Invalid token" });
    }
  
 
        
}


}
async function validatetoken(url,){
    const response = await axios.get(url)
    return response.data;
    
    }
        
        


module.exports = UserController;
