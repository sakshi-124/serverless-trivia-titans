const functions = require("@google-cloud/functions-framework");
const { PubSub } = require("@google-cloud/pubsub");

functions.http("helloHttp", (req, res) => {
  const notification = {
    user: req.body.user,
    details: req.body.details,
  };
  console.log("notification", notification);

  publishNotification(notification);
  res.send(notification);
});

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
