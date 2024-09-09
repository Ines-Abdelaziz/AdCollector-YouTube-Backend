const pool = require("../db-config");
class UserStatsModel {
  static async getAdsByUser(userId) {
    try {
      const result = await pool.query(
        `SELECT a.*
        FROM ads a
        JOIN (
            SELECT ad_id FROM user_ad_video WHERE user_id = $1
            UNION
            SELECT ad_id FROM user_ads WHERE user_id = $1
        ) AS user_ad_union ON a.ad_id = user_ad_union.ad_id;

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
        `SELECT COUNT(*) FROM (
          select user_id from user_ad_video
          UNION ALL
          select user_id from user_ads
            )as combinedads
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
        FROM (
            SELECT ad_id FROM user_ad_video WHERE user_id = $1
            UNION
            SELECT ad_id FROM user_ads WHERE user_id = $1
        ) AS user_ad_union
        JOIN ads ON user_ad_union.ad_id = ads.ad_id
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
       SELECT
    ads.advertiser,
    ads.advertiser_link,
    ads.advertiser_location,
    COUNT(*) AS ad_count
    FROM (
        SELECT ad_id FROM user_ad_video WHERE user_id = $1
        UNION
        SELECT ad_id FROM user_ads WHERE user_id = $1
    ) AS user_ad_union
    JOIN ads ON user_ad_union.ad_id = ads.ad_id
    GROUP BY
        ads.advertiser,
        ads.advertiser_link,
        ads.advertiser_location
    ORDER BY
        ad_count DESC
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
                      WHEN reason ILIKE '%Your similarity to groups of people the advertiser is trying to reach%' THEN 'Your similarity to groups of people the advertiser is trying to reach'
                      WHEN reason ILIKE '%Websites you''ve visited%' THEN 'Websites you''ve visited'
                      WHEN reason ILIKE '%The advertiser’s interest in reaching new customers who haven’t bought something from them before%' THEN 'The advertiser’s interest in reaching new customers who haven’t bought something from them before'
                      ELSE reason
                  END AS normalized_reason
              FROM (
                  SELECT unnest(string_to_array(trim(both '{}' from ads.other_information::text), ',')) AS reason
                  FROM ads
                  JOIN (
                      SELECT ad_id FROM user_ad_video WHERE user_id = $1
                      UNION
                      SELECT ad_id FROM user_ads WHERE user_id = $1
                  ) AS user_ad_union ON ads.ad_id = user_ad_union.ad_id
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
                SELECT
                    replace(unnest(string_to_array(trim(both '{}' from ads.google_information::text), ',')), '"', '') AS reason
                FROM
                    ads
                JOIN (
                    SELECT ad_id FROM user_ad_video WHERE user_id = $1
                    UNION
                    SELECT ad_id FROM user_ads WHERE user_id =$1
                ) AS user_ad_union ON ads.ad_id = user_ad_union.ad_id
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

  static async getTargetingStartegies(userId) {
    try {
      const query = `SELECT classified_reason AS targeting_category, COUNT(*) AS occurrences
            FROM (
                SELECT
                    CASE
                        WHEN reason ILIKE '%The video you''re watching%' OR reason ILIKE '%La vidéo que vous regardez%'
                            THEN 'Placement-Based'

                        WHEN reason ILIKE '%Your similarity to groups of people the advertiser is trying to reach, according to your activity on this device%'
                            OR reason ILIKE '%L''estimation de Google concernant vos centres d''intérêt%'
                            OR reason ILIKE '%Google''s estimation of your interests, based on your activity%'
                            OR reason ILIKE '%Google''s estimation of your areas of interest, based on your activity%'
                            OR reason ILIKE '%Google''s estimation of your interests, based on your activity while you were signed in to Google%'
                            OR reason ILIKE '%Google''s estimation of your interests%'
                            OR reason ILIKE '%Websites you''ve visited%'
                            OR reason ILIKE '%Your similarity to groups of people the advertiser is trying to reach, according to your activity while you were signed in to Google%'
                            OR reason ILIKE '%The advertiser’s interest in reaching new customers who haven’t bought something from them before%'
                            OR reason ILIKE '%Your activity, while you were signed in to Google%'
                            THEN 'Interest-Based'

                    ELSE 'Other'
                    END AS classified_reason
                FROM (
                    SELECT unnest(string_to_array(trim(both '{}' from ads.other_information::text), ',')) AS reason
                    FROM ads
                    JOIN (
                        SELECT ad_id FROM user_ad_video WHERE user_id = $1
                        UNION
                        SELECT ad_id FROM user_ads WHERE user_id = $1
                    ) AS user_ad_union ON ads.ad_id = user_ad_union.ad_id
                ) AS extracted_reasons
            ) AS classified_reasons
            GROUP BY classified_reason
            ORDER BY occurrences DESC;
`;
      const { rows } = await pool.query(query, [userId]);
      return rows;
    } catch (error) {
      throw new Error("Error fetching targeting stratgies by user");
    }
  }
  static async getTargetingCombinations(userId) {
    try {
      const query = `
      WITH classified_reasons AS (
      SELECT 
          ads.ad_id,
          STRING_AGG(DISTINCT 
              CASE 
                  WHEN reason ILIKE '%The video you''re watching%' OR reason ILIKE '%La vidéo que vous regardez%' THEN 'Placement-Based'
                  WHEN reason ILIKE '%L''heure de la journée ou votre situation géographique générale%' 
                      OR reason ILIKE '%Votre situation géographique générale%' 
                      OR reason ILIKE '%Google''s estimation of your approximate current location%' 
                      OR reason ILIKE '%Your general location (like your country or city)%' 
                      OR reason ILIKE '%L''heure de la journée%' 
                      OR reason ILIKE '%The time of day or your general location (like your country or city)%' 
                      OR reason ILIKE '%The time of day%' THEN 'Geographic-Based'
                  WHEN reason ILIKE '%L''estimation de Google concernant vos centres d''intérêt%' 
                      OR reason ILIKE '%Your similarity to groups of people the advertiser is trying to reach, according to your activity on this device%' 
                      OR reason ILIKE '%Google''s estimation of your interests, based on your activity%' 
                      OR reason ILIKE '%Google''s estimation of your areas of interest, based on your activity%' 
                      OR reason ILIKE '%Google''s estimation of your interests, based on your activity while you were signed in to Google%' 
                      OR reason ILIKE '%Google''s estimation of your interests%' 
                      OR reason ILIKE '%Websites you''ve visited%' 
                      OR reason ILIKE '%Your similarity to groups of people the advertiser is trying to reach, according to your activity while you were signed in to Google%' 
                      OR reason ILIKE '%The advertiser’s interest in reaching new customers who haven’t bought something from them before%' 
                      OR reason ILIKE '%Your activity, while you were signed in to Google%' THEN 'Interest-Based'
                  ELSE NULL 
              END, ','
          ) AS strategies
          FROM ads
          JOIN (
              SELECT ad_id 
              FROM user_ad_video 
              WHERE user_id = $1
              UNION
              SELECT ad_id 
              FROM user_ads 
              WHERE user_id = $1
          ) AS user_ad_union ON ads.ad_id = user_ad_union.ad_id,
          LATERAL unnest(string_to_array(trim(both '{}' from ads.other_information::text), ',')) AS reason
          GROUP BY ads.ad_id
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
  static async getPlacmentBasedPerVideo(userId) {
    try {
      const query = `SELECT 
            uav.video_id, 
            COUNT(*) AS total_ads_count,
            COUNT(
                CASE 
                    WHEN reason ILIKE '%The video you''re watching%' 
                      OR reason ILIKE '%La vidéo que vous regardez%' 
                    THEN 1 
                    ELSE NULL 
                END
            ) AS placement_based_ad_count
        FROM ads
        JOIN (
            SELECT ad_id, video_id 
            FROM user_ad_video 
            WHERE user_id = $1
            UNION
            SELECT ad_id, video_id 
            FROM user_ads 
            WHERE user_id = $1
        ) AS uav ON ads.ad_id = uav.ad_id
        JOIN LATERAL unnest(string_to_array(trim(both '{}' from ads.other_information::text), ',')) AS reason ON TRUE
        GROUP BY uav.video_id
        ORDER BY placement_based_ad_count DESC;
        `;
      const { rows } = await pool.query(query, [userId]);
      return rows;
    } catch (error) {
      throw new Error("Error fetching placment based per video by user");
    }
  }
  static async getCountPoliticalsAd(userId) {
    try {
      const query = `SELECT
                      uav.user_id,
                      COUNT(CASE WHEN pa.political = TRUE THEN 1 ELSE NULL END) AS political_ad_count,
                      COUNT(CASE WHEN pa.political = FALSE OR pa.political IS NULL THEN 1 ELSE NULL END) AS non_political_ad_count
                  FROM (
                      SELECT ad_id, user_id
                      FROM user_ad_video
                      WHERE user_id = $1
                      UNION
                      SELECT ad_id, user_id
                      FROM user_ads
                      WHERE user_id = $1
                  ) AS uav
                  JOIN ads ON uav.ad_id = ads.ad_id
                  LEFT JOIN political_ads pa ON ads.adlink = pa.adlink
                  GROUP BY uav.user_id
                  ORDER BY uav.user_id;

                  `;
      const { rows } = await pool.query(query, [userId]);
      return rows;
    } catch (error) {
      throw new Error("Error fetching poltical ads number by user");
    }
  }
  static async getPolticalAds(userId) {
    try {
      const query = `WITH classified_ads AS (
    SELECT
        uav.user_id,
        ads.ad_id,
        ads.advertiser,
        ads.advertiser_link,
        ads.advertiser_location,
        ads.adlink,
        pa.political,
        CASE
            WHEN reason ILIKE ANY (ARRAY[
                '%The video you''re watching%',
                '%La vidéo que vous regardez%'
            ]) THEN 'Placement-Based'

            WHEN reason ILIKE ANY (ARRAY[
                '%L''heure de la journée%',
                '%The time of day%',
                '%Your general location%',
                '%Your approximate current location%',
                '%Your situation géographique générale%'
            ]) THEN 'Geographic-Based'

            WHEN reason ILIKE ANY (ARRAY[
                '%Google''s estimation of your interests%',
                '%Websites you''ve visited%',
                '%Your similarity to groups of people%',
                '%The advertiser’s interest in reaching new customers who haven’t bought something from them before%',
                '%Your activity, while you were signed in to Google%'
            ]) THEN 'Interest-Based'

            ELSE 'Unknown'
        END AS targeting_strategy
    FROM (
        SELECT ad_id, user_id
        FROM user_ad_video
        WHERE user_id = $1
        UNION
        SELECT ad_id, user_id
        FROM user_ads
        WHERE user_id = $1
    ) AS uav
    JOIN ads ON uav.ad_id = ads.ad_id
    LEFT JOIN political_ads pa ON ads.adlink = pa.adlink
    JOIN LATERAL unnest(string_to_array(trim(both '{}' from ads.other_information::text), ',')) AS reason ON TRUE
    WHERE pa.political = TRUE
),
strategy_combinations AS (
    SELECT
        user_id,
        ad_id,
        advertiser,
        advertiser_link,
        advertiser_location,
        adlink,
        STRING_AGG(DISTINCT targeting_strategy, ', ') AS strategy_combination
    FROM classified_ads
    GROUP BY user_id, ad_id, advertiser, advertiser_link, advertiser_location, adlink
)
SELECT *
FROM strategy_combinations
ORDER BY user_id, ad_id;
`;
      const { rows } = await pool.query(query, [userId]);
      return rows;
    } catch (error) {
      throw new Error("Error fetching poltical ads  by user");
    }
  }

  static async getPolticalPlacmentAds(userId) {
    try {
      const query = `WITH classified_ads AS (
    SELECT
        uav.user_id,
        ads.ad_id,
        CASE
            WHEN reason ILIKE ANY (ARRAY[
                '%The video you''re watching%',
                '%La vidéo que vous regardez%'
            ]) THEN 'Placement-Based'

            ELSE 'Not Placement-Based'
        END AS targeting_strategy
    FROM (
        SELECT ad_id, user_id
        FROM user_ad_video
        WHERE user_id = $1
        UNION
        SELECT ad_id, user_id
        FROM user_ads
        WHERE user_id = $1
    ) AS uav
    JOIN ads ON uav.ad_id = ads.ad_id
    LEFT JOIN political_ads pa ON ads.adlink = pa.adlink
    JOIN LATERAL unnest(string_to_array(trim(both '{}' from ads.other_information::text), ',')) AS reason ON TRUE
    WHERE pa.political = TRUE
),
ad_counts AS (
    SELECT
        user_id,
        COUNT(CASE WHEN targeting_strategy = 'Placement-Based' THEN 1 ELSE NULL END) AS placement_based_ad_count,
        COUNT(CASE WHEN targeting_strategy = 'Not Placement-Based' THEN 1 ELSE NULL END) AS poltical_ad_count
    FROM classified_ads
    GROUP BY user_id
)
SELECT *
FROM ad_counts
ORDER BY user_id;
`;
      const { rows } = await pool.query(query, [userId]);
      return rows;
    } catch (error) {
      throw new Error("Error fetching poltical ads placment based by user");
    }
  }
}
module.exports = UserStatsModel;
