let connectedClients = {};

exports.handler = async (event, context) => {
  const connectionId = event.requestContext.connectionId;

  try {
    if (event.requestContext.routeKey === '$connect') {
      // Handle new WebSocket connection
      await handleConnect(connectionId);
    } else if (event.requestContext.routeKey === '$disconnect') {
      // Handle WebSocket disconnection
      await handleDisconnect(connectionId);
    } else if (event.requestContext.routeKey === 'sendmessage') {
      // Handle incoming message
      const body = JSON.parse(event.body);
      const room = body.room;
      const message = body.message;
      const sender = body.sender;
      await handleMessage(connectionId, room, message, sender);
    }
  } catch (err) {
    console.error('Error:', err);
    return { statusCode: 500, body: 'Failed to process the request.' };
  }

  return { statusCode: 200, body: 'Success' };
};

async function handleConnect(connectionId) {
  // Save the connectionId in the local object to manage connected clients.
  connectedClients[connectionId] = true;
}

async function handleDisconnect(connectionId) {
  // Remove the connectionId from the local object to manage connected clients.
  delete connectedClients[connectionId];
}

async function handleMessage(connectionId, room, message, sender) {
  // Handle the incoming message and send it to other clients in the same room.
  // To send messages, you need to use the Amazon API Gateway Management API.

  const connectionIds = Object.keys(connectedClients);

  const AWS = require('aws-sdk');
  const apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: 'g4uc2afj8i.execute-api.us-east-1.amazonaws.com/production/', // Replace with your WebSocket API endpoint
  });

  const postData = JSON.stringify({
    room: room,
    message: message,
    sender: sender,
  });

  const postCalls = connectionIds.map(async (id) => {
    try {
      await apiGatewayManagementApi.postToConnection({
        ConnectionId: id,
        Data: postData,
      }).promise();
    } catch (err) {
      // Handle errors if a client is no longer reachable and remove the connectionId from the local object.
      delete connectedClients[id];
    }
  });

  await Promise.all(postCalls);
}
