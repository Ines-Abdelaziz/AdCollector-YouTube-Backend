const pool = require("../db-config");
class UserStatsModel {
  static async getAdsCollectedByUser(userId) {
    try {
      const result = await pool.query(
        "SELECT COUNT(*) FROM user_ad_video WHERE user_id = $1",
        [userId]
      );
      return result.rows[0].count;
    } catch (error) {
      throw new Error("Error fetching ads collected by user");
    }
  }
  //get topic occurence by user
  static async getTopicsOccurenceByUser(userId) {
    try {
      const query = `
        SELECT unnest_topic AS topic, COUNT(*) AS topic_count
        FROM (
            SELECT unnest(ads.topic) AS unnest_topic
            FROM user_ad_video
            JOIN ads ON user_ad_video.ad_id = ads.ad_id
            WHERE user_ad_video.user_id = $1
        ) AS subquery
        GROUP BY unnest_topic
        ORDER BY topic_count DESC;
         `;
      const { rows } = await pool.query(query, [userId]);
      return rows;
    } catch (error) {
      throw new Error("Error fetching topics occurence by user");
    }
  }
  // GET  top advertisers by user
  static async getTopAdvertisersByUser(userId) {
    try {
      const query = `
        SELECT ads.advertiser, ads.advertiser_link, ads.advertiser_location, COUNT(*) AS ad_count
        FROM user_ad_video
        JOIN ads ON user_ad_video.ad_id = ads.ad_id
        WHERE user_ad_video.user_id = $1
        GROUP BY ads.advertiser, ads.advertiser_link, ads.advertiser_location
        ORDER BY ad_count DESC
        LIMIT 5;
             `;
      const { rows } = await pool.query(query, [userId]);
      return rows;
    } catch (error) {
      throw new Error("Error fetching top advertisers by user");
    }
  }
  //get targeeting reasons by user
  static async getTargetingReasonsByUser(userId) {
    try {
      const query = `
            SELECT normalized_reason, COUNT(*) AS occurrences
            FROM (
                SELECT CASE
                    WHEN reason ILIKE '%time of day%' THEN 'The time of day'
                    WHEN reason ILIKE '%general location%' OR reason ILIKE '%current location%' THEN 'Your general location'
                    WHEN reason ILIKE '%interests, based on your activity%' THEN 'Google''s estimation of your interests, based on your activity'
                    WHEN reason ILIKE '%Google''s estimation of your interests%' THEN 'Google''s estimation of your interests, based on your activity'
                    WHEN reason ILIKE '%Google''s estimation of your areas of interest, based on your activity%' THEN 'Google''s estimation of your interests, based on your activity'

                    ELSE reason
                END AS normalized_reason
                FROM (
                    SELECT unnest(other_information) AS reason FROM ads
                    JOIN user_ad_video ON ads.ad_id = user_ad_video.ad_id
                    WHERE user_ad_video.user_id = $1
                ) AS all_reasons
            ) AS grouped_reasons
            WHERE  normalized_reason <> 'N/A'
            GROUP BY normalized_reason
            ORDER BY occurrences DESC;
             `;
      const { rows } = await pool.query(query, [userId]);
      return rows;
    } catch (error) {
      throw new Error("Error fetching targeting reasons by user");
    }
  }
}
module.exports = UserStatsModel;
