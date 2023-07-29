// Import required libraries
const functions = require("@google-cloud/functions-framework");
const { PubSub } = require("@google-cloud/pubsub");

/**
 * Function to handle HTTP request for the "helloHttp" endpoint.
 * This function is triggered when a request is made to the specified endpoint.
 * It allows cross-origin requests and handles preflight requests.
 * It also publishes a notification to a Pub/Sub topic.
 */
functions.http("helloHttp", (req, res) => {
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

  // Extract the notification details from the request body
  const notification = {
    user: req.body.user,
    details: req.body.details,
  };
  console.log("Received notification:", notification);

  // Publish the notification to a Pub/Sub topic
  publishNotification(notification);
  res.send(notification);
});

/**
 * Function to publish a notification to a Pub/Sub topic.
 */
async function publishNotification(notification) {
  const topicName = "notifications";
  const pubsub = new PubSub();

  try {
    const dataBuffer = Buffer.from(JSON.stringify(notification));

    const messageId = await pubsub
      .topic(topicName)
      .publishMessage({ data: dataBuffer });
    console.log(
      `Notification published to topic ${topicName}, message ID: ${messageId}`
    );
  } catch (error) {
    console.error("Error publishing notification:", error);
  }
}
