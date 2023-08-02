
SELECT
  document_id as user_name,
  JSON_EXTRACT_SCALAR(data, '$.totalMatches') AS total_matches,
  JSON_EXTRACT_SCALAR(data, '$.totalWins') AS total_wins,
  JSON_EXTRACT_SCALAR(data, '$.totalLosses') AS total_losses,
  JSON_EXTRACT_SCALAR(data, '$.totalPoints') AS total_points
 
FROM
  `trivia-titans-390605.firestore_user.UserStatistics_raw_latest`

 WHERE  document_id  IS NOT NULL

ORDER BY
  document_id;
