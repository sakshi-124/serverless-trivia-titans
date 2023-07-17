const functions = require("firebase-functions");
const admin = require("firebase-admin");
let serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const express = require("express");
const cors = require("cors");

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
                    Q3: req.body.Q3
                });
            return res.status(200).send({
                status: "success",
                message: "Data added successfully"
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                status: "Failed",
                message: error
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
                    message: "User Verified"
                });
            else
                return res.status(200).send({
                    status: "Failed",
                    message: "User Verification Failed"
                });
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                status: "Failed",
                message: error
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
                    userRegistered: false
                });
            }
            return res.status(200).send({
                status: "success",
                userRegistered: true
            });
        } catch (error) {
            console.log(error);
            return res.status(500).send({
                status: "Failed",
                message: error
            })
        }
    })();
});

exports.app = functions.https.onRequest(app);
