const pool = require("../db-config");

class UserAdVideoModel {
  static async addUserAdVideo(userAdVideoData) {
    const { ad_id, video_id, channel_id, user_id } = userAdVideoData;
    try {
      const result = await pool.query(
        "INSERT INTO user_ad_video ( ad_id, video_id,channel_id,user_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [ad_id, video_id, channel_id, user_id]
        
      );
      console.log("I changed the backend");
      return { message: "I changed the backend" };
    } catch (error) {
      console.log(error);
      throw new Error("Error adding user ad video association");
    }
  }
}

module.exports = UserAdVideoModel;
