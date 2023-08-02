
SELECT
 
  JSON_EXTRACT_SCALAR(data, '$.teamName') AS team_name,
  JSON_EXTRACT_SCALAR(data, '$.totalMatches') AS total_matches,
  JSON_EXTRACT_SCALAR(data, '$.totalWins') AS total_wins,
  JSON_EXTRACT_SCALAR(data, '$.totalLosses') AS total_losses,
  JSON_EXTRACT_SCALAR(data, '$.totalPoints') AS total_points
 
FROM
  `trivia-titans-390605.firestore_team.TeamStatistics_raw_latest`

 WHERE JSON_EXTRACT_SCALAR(data, '$.teamName')  IS NOT NULL

ORDER BY
  team_name;
