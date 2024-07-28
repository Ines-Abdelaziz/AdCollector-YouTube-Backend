const pool = require("../db-config");

class UserAdExperimentModel {
  static async addUserAdExperiment(userAdExperimentData) {
    const { ad_id, video_id, channel_id, user_id,original } = userAdExperimentData;
    try {
      const result = await pool.query(
        "INSERT INTO user_ad_experiment ( ad_id, video_id,channel_id,user_id,original) VALUES ($1, $2, $3, $4,$5) RETURNING *",
        [ad_id, video_id, channel_id, user_id,original]
      );
      return result.rows[0];
    } catch (error) {
      console.log(error);
      throw new Error("Error adding user ad experiment association");
    }
  }
  static async getAllExperiments() {
    try {
        const result = await pool.query('SELECT * FROM user_ad_experiment');
        return result.rows;
    } catch (error) {
        throw new Error('Error fetching experiments from the database');
    }
}
}

module.exports = UserAdExperimentModel;
