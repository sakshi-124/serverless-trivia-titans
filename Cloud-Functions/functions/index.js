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


//Update - put()



//Delete - delete()

//get category 
app.get('/getCategory', async (req, res) => {
    try {
      const collectionName = 'Category';
      const category = await admin.firestore().collection(collectionName).get();
      const categories = category.docs.map((doc) => {
        const categoryData = doc.data();
        
        return {
          label: categoryData.category,
          cate_id: categoryData.cate_id}
      });
      res.json(categories);
    } catch (error) {
      console.error('Error retrieving data:', error);
      res.status(500).send('Error retrieving data');
    }
  });

// get difficulty levels

app.get('/getLevel', async (req, res) => {
    try {
      const collectionName = 'DifficultyLevel';
      const level = await admin.firestore().collection(collectionName).orderBy('level_id').get();
      const levels = level.docs.map((doc) => {
        const levelData = doc.data();
        
        return {
          label: levelData.level,
          level_id: levelData.level_id}
      });
      res.json(levels);
    } catch (error) {
      console.error('Error retrieving data:', error);
      res.status(500).send('Error retrieving data');
    }
  });

// add question

app.post('/addQuestion', (req, res) => {
    const questionData = req.body;
  
    const { question, category, difficulty, option_1,option_2,option_3,option_4, correct_ans } = questionData;
  
    // Create a new document in Firestore's "questions" collection
    db.collection('Questions')
      .add({
        question,
        category,
        difficulty,
        option_1,
        option_2,
        option_3,
        option_4,
        correct_ans
      })
      .then(docRef => {
        res.status(200).json({ message: 'Question stored successfully', questionId: docRef.id });
      })
      .catch(error => {
        console.error('Error storing question:', error);
        res.status(500).json({ error: 'Something went wrong' });
      });
  });
  
exports.app = functions.https.onRequest(app);
