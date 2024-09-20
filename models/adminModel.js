const pool = require('../db-config');



class AdminModel {
    static async registerAdmin(username, hashedPassword) {
        const queryText = 'INSERT INTO admins (username, password) VALUES ($1, $2)';
        await pool.query(queryText, [username, hashedPassword]);
    }
    static async getAdminByUsername(username) {
        const result = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
        return result.rows[0];
    }
    static async getAds() {
      try {
          const result = await pool.query(
              `SELECT a.*, au.google_information, au.other_information
               FROM ads a
               JOIN ad_user au ON a.id = au.ad_id`
          );
          
          // Return the result rows, which should contain the ads data
          return result.rows;
      } catch (error) {
          // Log the actual error to the console for debugging
          console.error("Error in getAds:", error);
  
          // Throw a custom error message for the user
          throw new Error("Error fetching ads collected");
      }
  }
  
      static async getAdsCollected() {
        try {
          const result = await pool.query(
            `SELECT COUNT(*)
             FROM ad_user
            `
          );
          return result.rows[0].count;
        } catch (error) {
          throw new Error("Error fetching ads collected count ");
        }
      }
    
     
  static async getVidsWatched() {
    try {
      const query = `
        SELECT COUNT(*) AS videos_watched
        FROM watch_history wh
        JOIN videos v ON wh.video_id = v.id  -- Assuming 'id' is the primary key in 'videos'
      `;
      const result = await pool.query(query);
      return parseInt(result.rows[0].videos_watched, 10);  // Return the number of videos watched by the user
    } catch (error) {
      throw new Error("Error fetching the number of videos watched by user");
    }
  }
  
      
    
      static async getTopicsOccurence() {
        try {
          const query = `
          SELECT unnest_topic AS topic, COUNT(*) AS topic_count
          FROM (
              SELECT unnest(a.topic) AS unnest_topic
              FROM ad_user au
              JOIN ads a ON au.ad_id = a.id
          ) AS subquery
          GROUP BY unnest_topic
          ORDER BY topic_count DESC;
          `;
          const { rows } = await pool.query(query);
          return rows;
        } catch (error) {
          throw new Error("Error fetching topics occurrence");
        }
      }
    
      static async getTopAdvertisers() {
        try {
          const query = `
          SELECT
            a.advertiser,
            a.advertiser_link,
            a.advertiser_location,
            COUNT(*) AS ad_count
          FROM ad_user au
          JOIN ads a ON au.ad_id = a.id
          GROUP BY a.advertiser, a.advertiser_link, a.advertiser_location
          ORDER BY ad_count DESC
          LIMIT 5;
          `;
          const { rows } = await pool.query(query);
          return rows;
        } catch (error) {
          throw new Error("Error fetching top advertisers");
        }
      }
    
      static async getTargetingReasons() {
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
              ) AS all_reasons
          ) AS grouped_reasons
          WHERE normalized_reason <> 'N/A'
          GROUP BY normalized_reason
          ORDER BY occurrences DESC;
          `;
          const { rows } = await pool.query(query,);
          return rows;
        } catch (error) {
          throw new Error("Error fetching targeting reasons");
        }
      }
    
      static async getGoogleTargetingReasons() {
        try {
          const query = `
          SELECT reason, COUNT(*) AS occurrences
          FROM (
              SELECT replace(unnest(string_to_array(trim(both '{}' from au.google_information::text), ',')), '"', '') AS reason
              FROM ad_user au
          ) AS google_reasons
          WHERE reason <> 'N/A'
          GROUP BY reason
          ORDER BY occurrences DESC;
          `;
          const { rows } = await pool.query(query);
          return rows;
        } catch (error) {
          throw new Error("Error fetching Google targeting reasons by user");
        }
      }
    
      static async getTargetingStartegies() {
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
              ) AS extracted_reasons
          ) AS classified_reasons
          GROUP BY classified_reason
          ORDER BY occurrences DESC;
          `;
          const { rows } = await pool.query(query);
          return rows;
        } catch (error) {
          throw new Error("Error fetching targeting strategies");
        }
      }
      static async getTargetingCombinations() {
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
              GROUP BY au.ad_id
          )
          SELECT strategies AS strategy_combination, COUNT(*) AS occurrences
          FROM classified_reasons
          WHERE strategies IS NOT NULL
          GROUP BY strategies
          ORDER BY occurrences DESC;
          `;
          const { rows } = await pool.query(query);
          return rows;
        } catch (error) {
          throw new Error("Error fetching targeting combinations by user");
        }
      }
      static async getCountPoliticalsAd() {
        try {
          const query = `
          SELECT
              COUNT(CASE WHEN pa.political = TRUE THEN 1 ELSE NULL END) AS political_ad_count,
              COUNT(CASE WHEN pa.political = FALSE OR pa.political IS NULL THEN 1 ELSE NULL END) AS non_political_ad_count
          FROM ad_user au
          JOIN ads a ON au.ad_id = a.id  -- Use 'id' for 'ads' table
          LEFT JOIN political_ads pa ON a.id = pa.ad_id  -- Use 'ad_id' for 'political_ads' table
          ;
          `;
          const { rows } = await pool.query(query);
          return rows;
        } catch (error) {
          throw new Error("Error fetching political ads count",error.message);
        }
      }
      static async getPoliticalAds() {
        try {
          const query = `
            WITH classified_ads AS (
              SELECT
                au.user_id,  -- Include the user_id
                a.id,  -- 'id' from 'ads' table
                a.advertiser,
                a.advertiser_link,
                a.advertiser_location,
                pa.political,
                t.transcript,  -- Include transcript from 'transcripts' table
                CASE
                  WHEN reason ILIKE '%The video you''re watching%' THEN 'Placement-Based'
                  ELSE 'Interest-Based'
                END AS targeting_strategy
              FROM ad_user au  -- 'ad_user' table to get the user and 'other_information'
              JOIN ads a ON au.ad_id = a.id  -- Join ads table
              LEFT JOIN political_ads pa ON a.id = pa.ad_id  -- Join 'political_ads' table
              LEFT JOIN transcripts t ON a.id = t.ad_id  -- Join 'transcripts' table to fetch the transcript
              JOIN LATERAL unnest(string_to_array(trim(both '{}' from au.other_information::text), ',')) AS reason ON TRUE
              WHERE pa.political = TRUE  -- Only fetch political ads
            )
            SELECT * FROM classified_ads;
          `;
      
          const { rows } = await pool.query(query);
          return rows;
        } catch (error) {
          console.error("Error fetching political ads:", error.message);
          throw new Error("Error fetching political ads");
        }
      }
      
      
      static async getPolticalPlacmentAds() {
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
              WHERE pa.political = TRUE
          )
          SELECT targeting_strategy, COUNT(*) AS occurrences
          FROM classified_ads
          GROUP BY targeting_strategy
          ORDER BY occurrences DESC;
          `;
          const { rows } = await pool.query(query);
          return rows;
        } catch (error) {
          throw new Error("Error fetching placement-based political ads");
        }
      }

      static async getPlacmentBasedPerVideo() {
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
            ) AS uav
            GROUP BY video_id
            ORDER BY placement_based_ad_count DESC;
          `;
          const { rows } = await pool.query(query);
          return rows;
        } catch (error) {
          throw new Error("Error fetching placement-based ads per video");
        }
      }
}




module.exports = AdminModel;