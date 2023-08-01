// Import required libraries
const functions = require("@google-cloud/functions-framework");
const sgMail = require("@sendgrid/mail");
let serviceAccount = require("./serviceAccountKeys.json");
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
// Initialize the SendGrid API key
sgMail.setApiKey(
  "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"
);

/**
 * Function to handle CloudEvent for the "helloPubSub" event.
 * This function is triggered when a CloudEvent is received for the specified event.
 * It processes the received Pub/Sub message and sends an email using SendGrid.
 */
functions.cloudEvent("helloPubSub", async (cloudEvent) => {
  console.log("event=>", cloudEvent);
  console.log(cloudEvent.data);
  const message = cloudEvent.data.message;
  console.log(message);

  const pubsubData = message.data
    ? Buffer.from(message.data, "base64").toString()
    : "";

  const data = JSON.parse(pubsubData);
  const datetime = new Date().toLocaleString();
  console.log("Received Pub/Sub message:", pubsubData);

  console.log(`new notification: ${pubsubData}`);

  // Send an email using SendGrid
  const msg = {
    to: data.user,
    from: "rt431563@dal.ca",
    subject: "New Notification",
    text: `Details of the notification: ${pubsubData}).`,
  };

  const id = Math.random() * 1000 + 1;
  try {
    await sgMail.send(msg);
    console.log("Email sent successfully.");
    await db.collection("Notifications").doc().create({
      id,
      data,
      email: data.user,
      datetime,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
});
