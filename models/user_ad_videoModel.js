const pool = require("../db-config");

class UserAdVideoModel {
  static async addUserAdVideo(userAdVideoData) {
    const { ad_id, video_id, channel_id, user_id,original,google_information,other_information } = userAdVideoData;
    try {
      const result = await pool.query(
        "INSERT INTO ad_user ( ad_id, video_id,channel_id,user_id,original,google_information,other_information) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [ad_id, video_id, channel_id, user_id,original,google_information,other_information]
      );
      return result.rows[0];
    } catch (error) {
      console.log(error);
      throw new Error("Error adding user ad video association");
    }
  }
}

module.exports = UserAdVideoModel;
