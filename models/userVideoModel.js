const pool = require('../db-config');

class UserVideoModel {
    static async addUserVideo(userVideoData) {
        const { user_id, video_id } = userVideoData;
        const timestamp = new Date();
        try {
          const result = await pool.query(
            "INSERT INTO watch_history (user_id,video_id,timestamp) VALUES ($1, $2, $3) RETURNING *",
            [user_id, video_id, timestamp]
          );
          return result.rows[0];
        } catch (error) {
          console.log(error);
          throw new Error("Error adding user video association");
        }
      }
  static async getUserVideoByAllColumns(userVideoData) {
    const { user_id, video_id } = userVideoData;
    try {
      const result = await pool.query(
        "SELECT * FROM watch_history WHERE user_id = $1 AND video_id = $2",
        [user_id, video_id]
      );
      return result.rows[0];
    } catch (error) {
      console.error("Error fetching user video by ID:", error);
      return null; // Return null if there was an error
    }
  }
}

module.exports = UserVideoModel;