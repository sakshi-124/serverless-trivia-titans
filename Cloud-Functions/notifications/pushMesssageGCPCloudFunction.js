const functions = require("@google-cloud/functions-framework");
const { PubSub } = require("@google-cloud/pubsub");

functions.http("helloHttp", (req, res) => {
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
