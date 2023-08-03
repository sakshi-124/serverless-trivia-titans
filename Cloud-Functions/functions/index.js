const functions = require("firebase-functions");
const admin = require("firebase-admin");
let serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const express = require("express");
const cors = require("cors");
const https = require("https");
const { Timestamp } = require("firebase-admin/firestore");

//Main database reference
const db = admin.firestore();

//Main App
const app = express();
app.use(cors({ origin: ['http://localhost:3000'] }));

//Routes
app.get("/", (req, res) => {
  console.log("Hello World!");
  res.status(200).send("Hello World!");
});

//Create - post()
app.post("/createQ&A", (req, res) => {
  (async () => {
    try {
      await db
        .collection("Q&A")
        .doc("/" + req.body.email + "/")
        .create({
          Q1: req.body.Q1,
          Q2: req.body.Q2,
          Q3: req.body.Q3,
        });
      return res.status(200).send({
        status: "success",
        message: "Data added successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "Failed",
        message: error,
      });
    }
  })();
});

app.post("/VerifyQ&A", (req, res) => {
  (async () => {
    try {
      const document = db.collection("Q&A").doc("/" + req.body.email + "/");
      let user = await document.get();
      let response = user.data();
      let questionType = req.body.question;
      if (req.body.answer == response[questionType].answer)
        return res.status(200).send({
          status: "success",
          message: "User Verified",
        });
      else
        return res.status(200).send({
          status: "Failed",
          message: "User Verification Failed",
        });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "Failed",
        message: error,
      });
    }
  })();
});

//Get - get()

app.get("/getUserStatus/:email", (req, res) => {
  (async () => {
    try {
      const document = db.collection("Q&A").doc(req.params.email);
      let user = await document.get();
      let response = user.data();
      if (!response) {
        return res.status(200).send({
          status: "success",
          userRegistered: false,
        });
      }
      return res.status(200).send({
        status: "success",
        userRegistered: true,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "Failed",
        message: error,
      });
    }
  })();
});

app.get("/getUserStats", (req, res) => {
  (async () => {
    try {
      const collectionRef = db.collection("UserStatistics");
      const documents = [];
      await collectionRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // Extract the data of each document and add it to the array
          const email = doc.id;
          documents.push({
            email: email,
            stats: doc.data(),
          });
        });
      });
      return res.status(200).send({
        status: "success",
        stats: documents,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "Failed",
        message: error,
      });
    }
  })();
});

app.put('/updateLastActivity/:email', async (req, res) => {
  try {
    const email = req.params.email;

    const timestamp = Timestamp.now();
    console.log(timestamp);

    const userStatsRef = db.collection('UserStatistics').doc(email);

    await userStatsRef.update({ lastActivity: timestamp });

    return res.status(200).json({ success: true, message: 'LastActivity updated successfully' });
  } catch (error) {
    console.error('Error updating LastActivity:', error);
    return res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

app.get("/getUserTeams/:email", (req, res) => {
  (async () => {
    try {
      const snapshot = await db
        .collection("teams")
        .where("members", "array-contains", {
          email: req.params.email,
          status: "member",
        })
        .get();
      if (snapshot.empty) {
        // sending success response
        return res.status(200).send({
          status: "success",
          teams: [],
        });
      }
      const teams = [];
      // pushing the users to the array except the current user
      await snapshot.forEach((doc) => {
        teams.push({
          id: doc.id,
          name: doc.data().message,
        });
      });
      // sending success response
      return res.status(200).send({
        status: "success",
        teams: teams,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: "Failed",
        message: error,
      });
    }
  })();
});

app.post("/leaveTeam/:teamId/:email", async (req, res) => {
  try {
    const teamId = req.params.teamId;
    const email = req.params.email;

    // Check if the team with the given teamId exists
    const teamRef = db.collection("teams").doc(teamId);
    const teamDoc = await teamRef.get();

    if (!teamDoc.exists) {
      return res.status(404).send({
        status: "failed",
        message: "Team not found.",
      });
    }

    // Check if the current user is a member of the team
    const teamData = teamDoc.data();
    const members = teamData.members;

    const memberIndex = members.findIndex((member) => member.email === email);

    if (memberIndex === -1) {
      return res.status(400).send({
        status: "failed",
        message: "You are not a member of this team.",
      });
    }

    // Remove the member from the members array
    members.splice(memberIndex, 1);

    // Update the team document with the updated members array
    await teamRef.update({
      members: members,
    });

    return res.status(200).send({
      status: "success",
      message: "Successfully left the team.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "failed",
      message: "An error occurred while processing your request.",
    });
  }
});

app.post("/createTeamTopic", async (req, res) => {
  //api call to create an sns topic for team
  const message = req.body.team;
  const email = req.body.email;
  const game = req.body.game;
  console.log(req.body)
  try {
    db.collection("teams")
      .doc()
      .create({
        email,
        game,
        message,
        members: [
          {
            email,
            status: "owner",
          },
        ],
        memberEmails: [email],
      });
    const topic_name = message;
    console.log(topic_name);
    const team_data = {
      topic_name: topic_name,
      email: email,
    };

    const sns_req = https.request(
      "https://3mdp3x7cloxzb5ddppcajldwki0cvyyx.lambda-url.us-east-1.on.aws/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    sns_req.write(JSON.stringify(team_data));

    sns_req.end();

    await res.send({
      status: "success",
      message: "New Team Created",
      team_name: topic_name,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      error: error,
    });
  }
});

app.post("/createTeam", async (req, res) => {
  const email = req.body.email;
  const game = req.body.game;
  const lambdaUrl =
    "https://o2xgulaifceul26nn5fcfpeisq0bxaow.lambda-url.us-east-1.on.aws/";
  const requestBody = JSON.stringify({ key1: "value1", key2: "value2" }); // Replace with your payload

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": requestBody.length,
    },
  };

  const request = https.request(lambdaUrl, options, (response) => {
    let data = "";
    response.on("data", (chunk) => {
      data += chunk;
    });
    response.on("end", async () => {
      console.log(data);
      const message = JSON.parse(data).choices[0].message.content;
      console.log(message);
      await res.send({
        team: message,
      });
    });
  });
  request.on("error", (error) => {
    console.error("Error calling Lambda function:", error);
  });

  request.write(requestBody);
  request.end();
});

app.get("/acceptInvite", async (req, res) => {
  //add the user to invited
  console.log("accept Invite");

  const email = req.query.email;
  const team = req.query.team;

  const newMember = {
    email,
    status: "member",
  };

  try {
    const teamsRef = db.collection("teams");

    // Find the document with the provided team name
    const querySnapshot = await teamsRef.where("message", "==", team).get();

    // Check if the document exists
    if (querySnapshot.empty) {
      console.log(`Team with name "${team}" not found.`);
      return;
    }

    console.log("here");

    // Assuming there's only one document with the team name, get the reference to it
    const teamDocRef = querySnapshot.docs[0].ref;

    // Retrieve the current members array from the document
    const teamDoc = await teamDocRef.get();
    const currentMembers = teamDoc.get("members") || [];
    const memberEmails = teamDoc.get("memberEmails") || [];

    console.log(memberEmails);

    if (!memberEmails.includes(email)) {
      console.log("inside if");
      memberEmails.push(email);
    }

    console.log("current members: " + currentMembers);

    // Check if the new member is already in the array
    if (currentMembers.includes(newMember)) {
      console.log(
        `Member "${newMember}" is already part of team "${teamName}".`
      );
    } else {
      // Add the new member to the array
      currentMembers.push(newMember);

      // Update the "members" field with the modified array
      const response = await teamDocRef.update({ members: currentMembers, memberEmails: memberEmails });

      console.log(response);

      res.send({ status: "success", team: JSON.stringify(teamDoc) });
    }
  } catch (error) {
    res.status(500).send({
      error: error,
    });
  }
});
//get category
app.get("/getCategory", async (req, res) => {
  try {
    const collectionName = "Category";
    const category = await admin.firestore().collection(collectionName).get();
    const categories = category.docs.map((doc) => {
      const categoryData = doc.data();

      return {
        label: categoryData.category,
        category_id: categoryData.cate_id,
      };
    });
    res.json(categories);
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).send("Error retrieving data");
  }
});

// get difficulty levels

app.get("/getLevel", async (req, res) => {
  try {
    const collectionName = "DifficultyLevel";
    const level = await admin
      .firestore()
      .collection(collectionName)
      .orderBy("level_id")
      .get();
    const levels = level.docs.map((doc) => {
      const levelData = doc.data();

      return {
        label: levelData.level,
        level_id: levelData.level_id,
      };
    });
    res.json(levels);
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).send("Error retrieving data");
  }
});

// add question

app.post("/addQuestion", (req, res) => {
  console.log(req.body);
  const questionData = req.body;

  const {
    question,
    category,
    difficulty,
    option_1,
    option_2,
    option_3,
    option_4,
    correct_ans,
    status,
    hint,
    explanation,
  } = questionData;

  // Create a new document in Firestore's "questions" collection
  db.collection("Questions")
    .doc(question)
    .set({
      question,
      category,
      difficulty,
      option_1,
      option_2,
      option_3,
      option_4,
      correct_ans,
      status,
      hint,
      explanation,
    })
    .then((docRef) => {
      res.status(200).json({
        message: "Question stored successfully",
        questionId: docRef.id,
      });
    })
    .catch((error) => {
      console.error("Error storing question:", error);
      res.status(500).json({ error: "Something went wrong" });
    });
});

app.post("/getTeam", (req, res) => {
  const team_name = req.body.team_name;
  const game = req.body.game;
  const team = db
    .collection("teams")
    .where("message", "==", team_name)
    .get();
  team.then((snapshot) => {
    console.log(snapshot.docs[0]);
    res.send(snapshot.docs[0].data());
  });
});

app.post("/checkUserGameStatus", async (req, res) => {
  console.log("request started")
  const user = req.body.email;
  const gameId = req.body.game;
  try {
    const teamsRef = db.collection("teams");
    const querySnapshot = await teamsRef
      .where("memberEmails", "array-contains", user)
      .get();

    if (!querySnapshot.empty) {
      let gamePlayed = false;
      querySnapshot.forEach((doc) => {
        console.log(doc)
        const teamData = doc.data();
        if (teamData.playedGames) {

          teamData.playedGames.forEach((game) => {
            if (game.gameID === gameId) {
              gamePlayed = true;
            }
          });
          const team=teamData.message
          const response={
            played: gamePlayed,
            gameID: gameId,
            team
          }
          res.send(response);
        }
        else {
          // The team doesn't have the played game or the game is not played
          res.send({
            played: false,
            gameID: gameId,
            team: teamData.message
          });
        }
      });
    }
    else {
      // The team doesn't have the played game or the game is not played
      res.send({
        played: false,
        gameID: gameId,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred.");
  }
});

exports.app = functions.https.onRequest(app);
