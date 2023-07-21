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
const accept_invite = express();
accept_invite.use(cors({ origin: true }));

accept_invite.post("/accept",(req,res)=>{
    res.send("response")
})


exports.accept_invite = functions.https.onRequest(accept_invite);