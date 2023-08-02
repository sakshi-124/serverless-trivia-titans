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
  .document("Questions/{questionId}")
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
