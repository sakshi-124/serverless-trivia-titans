const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { v1 } = require("@google-cloud/language");
let serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const language = new v1.LanguageServiceClient();
const firestore = admin.firestore();

exports.tagQuestionsFromFirestore = functions.firestore
  .document("Questions/{documentId}")
  .onCreate(async (snapshot, context) => {
    try {
      const question = snapshot.data().question;
      console.log("Retrieved question:", question);
      await tagQuestion(question);
    } catch (error) {
      console.error("Error:", error);
    }
  });

async function tagQuestion(question) {
  try {
    const [result] = await language.classifyText({
      document: {
        content: question,
        type: "PLAIN_TEXT",
      },
    });

    const topCategory =
      result.categories && result.categories.length > 0
        ? result.categories[0].name.split("/")[1]
        : "Uncategorized";

    console.log("NLP classification category:", topCategory);

    const categoryRef = firestore
      .collection("Category")
      .where("category", "==", topCategory);
    const categorySnapshot = await categoryRef.get();

    if (!categorySnapshot.empty) {
      const categoryId = categorySnapshot.docs[0].data().cate_id;

      const questionsRef = firestore.collection("Questions");
      const questionsSnapshot = await questionsRef
        .where("question", "==", question)
        .get();

      if (!questionsSnapshot.empty) {
        const questionDocId = questionsSnapshot.docs[0].id;

        await questionsRef.doc(questionDocId).update({
          category: categoryId,
        });

        console.log("Question category updated successfully.");
        console.log("Matched category from Firestore collection:", categoryId);
      } else {
        console.log("Question not found.");
      }
    } else {
      console.log("Category not found.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

const express = require("express");
const cors = require("cors");

// Main database reference
const db = admin.firestore();

// Main App
const app = express();
app.use(cors({ origin: true }));

// Routes
app.get("/", (req, res) => {
  console.log("Hello World!");
  res.status(200).send("Hello World!");
});

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

exports.app = functions.https.onRequest(app);
