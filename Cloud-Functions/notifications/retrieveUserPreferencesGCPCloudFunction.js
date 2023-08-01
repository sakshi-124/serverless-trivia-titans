// Import required libraries
const functions = require("@google-cloud/functions-framework");
const admin = require("firebase-admin");

// Load Firebase service account credentials from a local file
let serviceAccount = require("./credentials.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

/**
 * Function to handle HTTP request for getting user preferences.
 * This function is triggered when a request is made to the specified endpoint.
 * It allows cross-origin requests and handles preflight requests.
 * It retrieves user preferences from Firestore based on the provided email parameter.
 */
functions.http("getUserPreferences", async (req, res) => {
  // Set CORS headers for cross-origin requests
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Credentials", "true");
  res.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT");
  res.set(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
  );

  if (req.method === "OPTIONS") {
    // Handle preflight requests by sending a 204 No Content response
    res.status(204).send("");
    return;
  }

  try {
    const { email } = req.body;

    if (!email) {
      // If the "email" parameter is missing, return a 400 Bad Request response
      return res.status(400).send({ error: "Email parameter is missing." });
    }

    // Retrieve user preferences from Firestore
    const data = await getUserPreferences(email);
    console.log(data);

    if (!data) {
      // If user preferences are not found, return a 404 Not Found response
      return res.status(404).send({ error: "User preferences not found." });
    }

    // Send user preferences in the response
    res.send({ preferences: data });
  } catch (error) {
    console.error("Error getting preferences:", error);
    res
      .status(500)
      .send({ error: "An error occurred while getting preferences." });
  }
});

/**
 * Function to retrieve user preferences from Firestore.
 */
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
