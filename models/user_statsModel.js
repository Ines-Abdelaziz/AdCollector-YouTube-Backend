const pool = require("../db-config");

class UserStatsModel {
  static async getAdsByUser(userId) {
    try {
      const result = await pool.query(
        `SELECT a.*,au.google_information, au.other_information
        FROM ads a
        JOIN ad_user au ON a.id = au.ad_id
        WHERE au.user_id = $1;
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
        `SELECT COUNT(*)
         FROM ad_user
         WHERE user_id = $1`,
        [userId]
      );
      return result.rows[0].count;
    } catch (error) {
      throw new Error("Error fetching ads collected by user");
    }
  }

  static async getVidsWatchedByUser(userId) {
    try {
      const query = `
        SELECT COUNT(*) AS videos_watched
        FROM watch_history wh
        JOIN videos v ON wh.video_id = v.id  -- Assuming 'id' is the primary key in 'videos'
        WHERE wh.user_id = $1
      `;
      const result = await pool.query(query, [userId]);
      return parseInt(result.rows[0].videos_watched, 10);  // Return the number of videos watched by the user
    } catch (error) {
      throw new Error("Error fetching the number of videos watched by user");
    }
  }
  

  static async getTopicsOccurenceByUser(userId) {
    try {
      const query = `
      SELECT unnest_topic AS topic, COUNT(*) AS topic_count
      FROM (
          SELECT unnest(a.topic) AS unnest_topic
          FROM ad_user au
          JOIN ads a ON au.ad_id = a.id
          WHERE au.user_id = $1
      ) AS subquery
      GROUP BY unnest_topic
      ORDER BY topic_count DESC;
      `;
      const { rows } = await pool.query(query, [userId]);
      return rows;
    } catch (error) {
      throw new Error("Error fetching topics occurrence by user");
    }
  }

  static async getTopAdvertisersByUser(userId) {
    try {
      const query = `
      SELECT
        a.advertiser,
        a.advertiser_link,
        a.advertiser_location,
        COUNT(*) AS ad_count
      FROM ad_user au
      JOIN ads a ON au.ad_id = a.id
      WHERE au.user_id = $1
      GROUP BY a.advertiser, a.advertiser_link, a.advertiser_location
      ORDER BY ad_count DESC
      LIMIT 5;
      `;
      const { rows } = await pool.query(query, [userId]);
      return rows;
    } catch (error) {
      throw new Error("Error fetching top advertisers by user");
    }
  }

  static async getTargetingReasonsByUser(userId) {
    try {
      const query = `
      SELECT normalized_reason, COUNT(*) AS occurrences
      FROM (
          SELECT
              CASE
                  WHEN reason ILIKE '%time of day%' OR reason ILIKE '%location%'
                      THEN 'The time of day or your general location (like your country or city)'
                  WHEN reason ILIKE '%interests%' THEN 'Google''s estimation of your interests'
                  WHEN reason ILIKE '%activity%' THEN 'Based on your activity'
                  ELSE reason
              END AS normalized_reason
          FROM (
              SELECT unnest(string_to_array(trim(both '{}' from au.other_information::text), ',')) AS reason
              FROM ad_user au
              WHERE au.user_id = $1
          ) AS all_reasons
      ) AS grouped_reasons
      WHERE normalized_reason <> 'N/A'
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
          SELECT replace(unnest(string_to_array(trim(both '{}' from au.google_information::text), ',')), '"', '') AS reason
          FROM ad_user au
          WHERE au.user_id = $1
      ) AS google_reasons
      WHERE reason <> 'N/A'
      GROUP BY reason
      ORDER BY occurrences DESC;
      `;
      const { rows } = await pool.query(query, [userId]);
      return rows;
    } catch (error) {
      throw new Error("Error fetching Google targeting reasons by user");
    }
  }

  static async getTargetingStartegies(userId) {
    try {
      const query = `
      SELECT classified_reason AS targeting_category, COUNT(*) AS occurrences
      FROM (
          SELECT
              CASE
                  WHEN reason ILIKE '%The video you''re watching%' THEN 'Placement-Based'
                  WHEN reason ILIKE '%Google''s estimation of your interests%' THEN 'Interest-Based'
                  ELSE 'Other'
              END AS classified_reason
          FROM (
              SELECT unnest(string_to_array(trim(both '{}' from au.other_information::text), ',')) AS reason
              FROM ad_user au
              WHERE au.user_id = $1
          ) AS extracted_reasons
      ) AS classified_reasons
      GROUP BY classified_reason
      ORDER BY occurrences DESC;
      `;
      const { rows } = await pool.query(query, [userId]);
      return rows;
    } catch (error) {
      throw new Error("Error fetching targeting strategies by user");
    }
  }

  static async getTargetingCombinations(userId) {
    try {
      const query = `
      WITH classified_reasons AS (
          SELECT 
              au.ad_id,
              STRING_AGG(DISTINCT 
                  CASE 
                      WHEN reason ILIKE '%The video you''re watching%' THEN 'Placement-Based'
                      WHEN reason ILIKE '%Google''s estimation of your interests%' THEN 'Interest-Based'
                      ELSE NULL 
                  END, ','
              ) AS strategies
          FROM ad_user au
          JOIN LATERAL unnest(string_to_array(trim(both '{}' from au.other_information::text), ',')) AS reason ON TRUE
          WHERE au.user_id = $1
          GROUP BY au.ad_id
      )
      SELECT strategies AS strategy_combination, COUNT(*) AS occurrences
      FROM classified_reasons
      WHERE strategies IS NOT NULL
      GROUP BY strategies
      ORDER BY occurrences DESC;
      `;
      const { rows } = await pool.query(query, [userId]);
      return rows;
    } catch (error) {
      throw new Error("Error fetching targeting combinations by user");
    }
  }
  static async getCountPoliticalsAd(userId) {
    try {
      const query = `
      SELECT
          au.user_id,
          COUNT(CASE WHEN pa.political = TRUE THEN 1 ELSE NULL END) AS political_ad_count,
          COUNT(CASE WHEN pa.political = FALSE OR pa.political IS NULL THEN 1 ELSE NULL END) AS non_political_ad_count
      FROM ad_user au
      JOIN ads a ON au.ad_id = a.id  -- Use 'id' for 'ads' table
      LEFT JOIN political_ads pa ON a.id = pa.ad_id  -- Use 'ad_id' for 'political_ads' table
      WHERE au.user_id = $1
      GROUP BY au.user_id
      ORDER BY au.user_id;
      `;
      const { rows } = await pool.query(query, [userId]);
      return rows;
    } catch (error) {
      throw new Error("Error fetching political ads count by user");
    }
  }
  
  static async getPolticalAds(userId) {
    try {
      const query = `
      WITH classified_ads AS (
          SELECT
              au.user_id,
              a.id,  -- Use 'id' for 'ads' table
              a.advertiser,
              a.advertiser_link,
              a.advertiser_location,
              pa.political,
              CASE
                  WHEN reason ILIKE '%The video you''re watching%' THEN 'Placement-Based'
                  ELSE 'Interest-Based'
              END AS targeting_strategy
          FROM ad_user au
          JOIN ads a ON au.ad_id = a.id  -- Use 'id' for 'ads' table
          LEFT JOIN political_ads pa ON a.id = pa.ad_id  -- Use 'ad_id' for 'political_ads' table
          JOIN LATERAL unnest(string_to_array(trim(both '{}' from au.other_information::text), ',')) AS reason ON TRUE
          WHERE au.user_id = $1 AND pa.political = TRUE
      )
      SELECT *
      FROM classified_ads
      ORDER BY user_id, id;  -- Use 'id' for 'ads' table
      `;
      const { rows } = await pool.query(query, [userId]);
      return rows;
    } catch (error) {
      throw new Error("Error fetching political ads by user");
    }
  }
  
  static async getPolticalPlacmentAds(userId) {
    try {
      const query = `
      WITH classified_ads AS (
          SELECT
              au.user_id,
              a.id,  -- Use 'id' for 'ads' table
              CASE
                  WHEN reason ILIKE '%The video you''re watching%' THEN 'Placement-Based'
                  ELSE 'Not Placement-Based'
              END AS targeting_strategy
          FROM ad_user au
          JOIN ads a ON au.ad_id = a.id  -- Use 'id' for 'ads' table
          LEFT JOIN political_ads pa ON a.id = pa.ad_id  -- Use 'ad_id' for 'political_ads' table
          JOIN LATERAL unnest(string_to_array(trim(both '{}' from au.other_information::text), ',')) AS reason ON TRUE
          WHERE au.user_id = $1 AND pa.political = TRUE
      )
      SELECT targeting_strategy, COUNT(*) AS occurrences
      FROM classified_ads
      GROUP BY targeting_strategy
      ORDER BY occurrences DESC;
      `;
      const { rows } = await pool.query(query, [userId]);
      return rows;
    } catch (error) {
      throw new Error("Error fetching placement-based political ads by user");
    }
  }
  static async getPlacmentBasedPerVideo(userId) {
    try {
      const query = `
        SELECT 
          video_id, 
          COUNT(*) AS total_ads_count,
          COUNT(
              CASE 
                  WHEN reason ILIKE '%The video you''re watching%' 
                    OR reason ILIKE '%La vidéo que vous regardez%' 
                  THEN 1 
                  ELSE NULL 
              END
          ) AS placement_based_ad_count
        FROM (
            SELECT 
                video_id, 
                unnest(string_to_array(trim(both '{}' from other_information::text), ',')) AS reason 
            FROM ad_user 
            WHERE user_id = $1
        ) AS uav
        GROUP BY video_id
        ORDER BY placement_based_ad_count DESC;
      `;
      const { rows } = await pool.query(query, [userId]);
      return rows;
    } catch (error) {
      throw new Error("Error fetching placement-based ads per video by user");
    }
  }
  
}

module.exports = UserStatsModel;
