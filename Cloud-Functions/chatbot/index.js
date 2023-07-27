const serviceAccount = require("./serviceAccountKeys.json");
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

exports.handler = async (event) => {
  try {
    console.log(event);
    let TeamName =
      event.sessionState.intent.slots.TeamName.value.interpretedValue;
    TeamName = TeamName.charAt(0).toUpperCase() + TeamName.slice(1);
    console.log("team", TeamName);

    const teamSnapShot = await db
      .collection("TeamStatistics")
      .where("TeamName", "==", TeamName)
      .get();

    let response = "";

    const team = [];
    teamSnapShot.forEach((doc) => {
      team.push(doc.data());
    });

    console.log("team", team);
    if (team.length > 0) {
      const scores = team[0]["TotalPoints"];
      console.log("scores", scores);

      response = `The total scores for ${TeamName}:\n${scores}`;
    } else {
      response = "Please enter a valid team name!";
    }
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
  } catch (error) {
    console.error("Error:", error);
    throw new Error("An error occurred while retrieving team scores");
  }
};
