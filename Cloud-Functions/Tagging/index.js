const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { v1 } = require("@google-cloud/language");
let serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const language = new v1.LanguageServiceClient();
const firestore = admin.firestore();

async function extractKeywords(question) {
  try {
    const document = {
      content: question,
      type: "PLAIN_TEXT",
    };
    const [response] = await language.analyzeEntities({ document });

    const keywords = response.entities.map((entity) =>
      entity.name.toLowerCase()
    );

    return keywords;
  } catch (error) {
    console.error("Error extracting keywords:", error);
    return [];
  }
}

async function classifyQuestion(question) {
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

    return topCategory;
  } catch (error) {
    console.error("Error classifying question:", error);
    return "Uncategorized";
  }
}

exports.tagQuestionsFromFirestore = functions.firestore
  .document("Questions/{questionId}")
  .onCreate(async (snapshot, context) => {
    try {
      const question = snapshot.data().question;

      const keywords = await extractKeywords(question);

      const category = await classifyQuestion(question);
      const categoryRef = firestore
        .collection("Category")
        .where("category", "==", category);
      const categorySnapshot = await categoryRef.get();
      const categoryId = categorySnapshot.docs[0].data().cate_id;

      const questionRef = snapshot.ref;
      await questionRef.set(
        { tags: keywords, category: categoryId },
        { merge: true }
      );

      console.log(
        "Tags and category generated and added to Firestore:",
        keywords,
        category
      );
    } catch (error) {
      console.error("Error:", error);
    }
  });
