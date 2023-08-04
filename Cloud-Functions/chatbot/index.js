// Import the required Firebase Admin SDK and initialize the app
const serviceAccount = require("./serviceAccountKeys.json");
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

/**
 * Cloud Function to handle the incoming event.
 * Retrieves team statistics from Firestore based on the provided team name.
 */
exports.handler = async (event) => {
  try {
    // Extract the team name from the user's request
    let teamName =
      event.sessionState.intent.slots.TeamName.value.interpretedValue;
    teamName = teamName.charAt(0).toUpperCase() + teamName.slice(1);
    console.log("team", teamName);

    // Query the TeamStatistics collection in Firestore for the provided team name
    const teamSnapShot = await db
      .collection("TeamStatistics")
      .where("teamName", "==", teamName)
      .get();

    let response = "";

    const team = [];
    teamSnapShot.forEach((doc) => {
      team.push(doc.data());
    });

    console.log("team", team);

    if (team.length > 0) {
      // If the team is found, retrieve and format the total scores
      const scores = team[0]["totalPoints"];
      console.log("scores", scores);

      response = `The total scores for ${teamName}:\n${scores}`;
    } else {
      // If the team is not found, respond with an error message
      response = "Please enter a valid team name!";
    }

    // Return the response object with the message and intent state
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
