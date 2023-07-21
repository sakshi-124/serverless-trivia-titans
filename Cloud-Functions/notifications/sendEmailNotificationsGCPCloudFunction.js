//API Gateway EndPoint: POST https://my-gateway-di5gxc31.uc.gateway.dev/notifications (parameters: user (string) and details (string or json))

const functions = require("@google-cloud/functions-framework");
const sgMail = require("@sendgrid/mail");

// Initialize the SendGrid API key
sgMail.setApiKey(
  "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"
);

functions.cloudEvent("helloPubSub", async (cloudEvent) => {
  console.log("event=>", cloudEvent);
  console.log(cloudEvent.data);
  const message = cloudEvent.data.message;
  console.log(message);

  const pubsubData = message.data
    ? Buffer.from(message.data, "base64").toString()
    : "";
  const data = JSON.parse(Buffer.from(message.data, "base64").toString());
  console.log("Received Pub/Sub message:", pubsubData);

  console.log(`new notificaiton: ${pubsubData}`);

  // Send an email using SendGrid
  const msg = {
    to: data.user,
    from: "rt431563@dal.ca",
    subject: "New Notification",
    text: `Details of the notification: ${pubsubData}).`,
  };

  try {
    await sgMail.send(msg);
    console.log("Email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
  }
});
