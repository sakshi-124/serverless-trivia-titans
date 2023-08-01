
SELECT
  DATE(TIMESTAMP_SECONDS(CAST(JSON_EXTRACT_SCALAR(match, '$.Date._seconds') AS INT64))) AS game_date,
  JSON_EXTRACT_SCALAR(data, '$.teamName') AS team_name,
    JSON_EXTRACT_SCALAR(data, '$.teamName') AS team_name,
  SUM(CAST(JSON_EXTRACT_SCALAR(match, '$.Points') AS INT64)) AS total_points
FROM
  `trivia-titans-390605.firestore_team.TeamStatistics_raw_latest`,
  UNNEST(JSON_EXTRACT_ARRAY(data, '$.matchHistory')) AS match
GROUP BY
  game_date,
  team_name
ORDER BY
  game_date;
