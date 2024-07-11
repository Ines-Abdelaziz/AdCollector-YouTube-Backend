const pool = require("../db-config");
class UserStatsModel {
  static async getAdsByUser(userId) {
    try {
      const result = await pool.query(
        `SELECT a.*
            FROM ads a
            JOIN user_ad_video uav ON a.ad_id = uav.ad_id
            WHERE uav.user_id = $1;
            `,
        [userId]
      );
      return result.rows;
    } catch (error) {
      throw new Error("Error fetching ads collected by user");
    }
  }
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
  static async getVidsWatchedByUser(userId) {
    try {
      const result = await pool.query(
        "select videos from users where user_id=$1",
        [userId]
      );
      return result.rows[0].videos;
    } catch (error) {
      throw new Error("Error fetching videos watched by user");
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
     SELECT
         CASE
                      WHEN reason ILIKE '%time of day%'
                          THEN 'The time of day or your general location (like your country or city)'
                      WHEN reason ILIKE '%location%' OR reason ILIKE '%current location%'
                          THEN 'The time of day or your general location (like your country or city)'
                      WHEN reason ILIKE '%interests%' THEN 'Google''s estimation of your interests'
                      WHEN reason ILIKE '%Google''s estimation of your interests%'
                          THEN 'Google''s estimation of your interests'
                      WHEN reason ILIKE '%Google''s estimation of your areas of interest%'
                          THEN 'Google''s estimation of your interests'
                      WHEN reason ILIKE '%activity%' THEN 'Based on your activity'
                      WHEN reason ILIKE '%The video you''re watching%' THEN 'The video you''re watching'
                      WHEN reason ILIKE '%Your similarity to groups of people the advertiser is trying to reach%' then 'Your similarity to groups of people the advertiser is trying to reach'
                      WHEN reason ILIKE '%Websites you''ve visited%' THEN 'Websites you''ve visited'
                      WHEN reason ILIKE '%The advertiser’s interest in reaching new customers who haven’t bought something from them before%' THEN 'The advertiser’s interest in reaching new customers who haven’t bought something from them before'

                      ELSE reason
           END AS normalized_reason
           FROM (
           SELECT unnest(string_to_array(trim(both '{}' from ads.other_information::text), ',')) AS reason
                 FROM ads
                          JOIN
                      user_ad_video ON ads.ad_id = user_ad_video.ad_id
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
  static async getGoogleTargetingReasonsByUser(userId) {
    try {
      const query = `
            SELECT reason, COUNT(*) AS occurrences
FROM (
    SELECT
        replace(unnest(string_to_array(trim(both '{}' from ads.google_information::text), ',')), '"', '') AS reason
    FROM
        ads
    JOIN
        user_ad_video ON ads.ad_id = user_ad_video.ad_id
    WHERE
        user_ad_video.user_id = $1
) AS google_reasons
WHERE
    reason <> 'N/A'
GROUP BY
    reason
ORDER BY
    occurrences DESC;


             `;
      const { rows } = await pool.query(query, [userId]);
      return rows;
    } catch (error) {
      throw new Error("Error fetching targeting reasons by user");
    }
  }
}
module.exports = UserStatsModel;
