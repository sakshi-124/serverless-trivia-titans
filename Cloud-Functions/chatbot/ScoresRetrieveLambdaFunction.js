const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  try {
    console.log(event);
    let TeamName =
      event.sessionState.intent.slots.TeamName.value.interpretedValue;
    TeamName = TeamName.charAt(0).toUpperCase() + TeamName.slice(1);
    console.log(TeamName);

    const params = {
      TableName: "TeamScores",
      FilterExpression: "TeamName = :name",
      ExpressionAttributeValues: {
        ":name": TeamName,
      },
    };

    const result = await dynamoDB.scan(params).promise();
    console.log(result.Items);

    if (result.Items.length > 0) {
      const scores = result.Items.reduce((acc, item) => {
        Object.entries(item.Scores).forEach(([game, score]) => {
          acc.push(`- Game ${game}: ${score} points`);
        });
        return acc;
      }, []);

      const response = `Here are the scores for ${TeamName}:\n${scores.join(
        "\n"
      )}`;

      return {
        sessionState: {
          dialogAction: {
            type: "Close",
          },
          intent: {
            name: event.sessionState.intent.name,
            state: "Fulfilled",
          },
        },
        messages: [
          {
            contentType: "PlainText",
            content: response,
          },
        ],
      };
    } else {
      return {
        sessionState: {
          dialogAction: {
            type: "Close",
          },
          intent: {
            name: event.sessionState.intent.name,
            state: "Fulfilled",
          },
        },
        messages: [
          {
            contentType: "PlainText",
            content: "Error occured!!!",
          },
        ],
      };
    }
  } catch (error) {
    console.error("Error:", error);
    throw new Error("An error occurred while retrieving team scores");
  }
};
