const functions = require("@google-cloud/functions-framework");
const admin = require("firebase-admin");
let serviceAccount = require("./credentials.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

functions.http("updatePreferences", async (req, res) => {
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
    const { email, preferences } = req.body;
    console.log(email, preferences);

    // Save the user's preferences in Firestore
    await saveUserPreferences(email, preferences);

    res.status(200).send({ message: "Preferences updated successfully." });
  } catch (error) {
    console.error("Error updating preferences:", error);
    res
      .status(500)
      .send({ error: "An error occurred while updating preferences." });
  }
});

functions.http("options", (req, res) => {
  // Set CORS headers for the OPTIONS method
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.status(200).send();
});

async function saveUserPreferences(email, preferences) {
  const db = admin.firestore();

  try {
    const userRef = db.collection("UserPreferences").doc(email);
    await userRef.set(preferences);
    console.log(`User preferences saved for email: ${email}`);
  } catch (error) {
    console.error("Error saving user preferences:", error);
    throw error;
  }
}
