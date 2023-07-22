const functions = require("@google-cloud/functions-framework");
const admin = require("firebase-admin");
let serviceAccount = require("./credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

functions.http("getUserPreferences", async (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Credentials", "true");
  res.set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.set(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );

  if (req.method === "OPTIONS") {
    // stop preflight requests here
    res.status(204).send("");
    return;
  }
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({ error: "Email parameter is missing." });
    }

    const data = await getUserPreferences(email);
    console.log(data);

    if (!data) {
      return res.status(404).send({ error: "User preferences not found." });
    }

    res.send({ preferences: data });
  } catch (error) {
    console.error("Error getting preferences:", error);
    res
      .status(500)
      .send({ error: "An error occurred while getting preferences." });
  }
});

async function getUserPreferences(email) {
  const db = admin.firestore();

  try {
    const userRef = db.collection("UserPreferences").doc(email);

    const doc = await userRef.get();
    if (doc.exists) {
      return doc.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user preferences:", error);
    throw error;
  }
}
