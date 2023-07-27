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
 * Function to handle HTTP request for updating user preferences.
 * This function is triggered when a POST request is made to the specified endpoint.
 * It allows cross-origin requests and handles preflight requests.
 */
functions.http("updatePreferences", async (req, res) => {
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
    const { email, preferences } = req.body;
    console.log("Received preferences update request for:", email, preferences);

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

/**
 * Function to handle HTTP request for the OPTIONS method.
 * This function is triggered when an OPTIONS request is made to the specified endpoint.
 * It sets CORS headers to allow certain HTTP methods and headers for cross-origin requests.
 */
functions.http("options", (req, res) => {
  // Set CORS headers for the OPTIONS method
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.status(200).send();
});

/**
 * Function to save user preferences to Firestore.
 * @param {string} email - The user's email address.
 * @param {Object} preferences - The user's preferences object to be saved.
 * @throws {Error} Throws an error if there's an issue while saving the preferences.
 */
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
