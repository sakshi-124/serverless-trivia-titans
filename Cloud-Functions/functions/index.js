const functions = require("firebase-functions");
const admin = require("firebase-admin");
let serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const express = require("express");
const cors = require("cors");
const https = require("https");

//Main database reference
const db = admin.firestore();

//Main App
const app = express();
app.use(cors({ origin: true }));

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
          });
        const topic_name = message;
        console.log(topic_name);
        const team_data = {
          topic_name: topic_name,
          email: email,
        };
        //api call to create an sns topic for team
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
      const response = await teamDocRef.update({ members: currentMembers });

      console.log(response);

      res.send({ status: "success" });
    }
  } catch (error) {
    res.status(500).send({
      error: error,
    });
  }
});

exports.app = functions.https.onRequest(app);
