// Author : Sakshi Chaitanya Vaidya
// B00917159
// Sakshi.Vaidya@dal.ca

const AWS = require('aws-sdk');
const activeConnections = new Set();
let names = {}; 

// function to broadcast a message to all connected players
const broadcastMessage = async (message) => {
  const apigatewayManagementApi = new AWS.ApiGatewayManagementApi({
    endpoint: "r6s5zxfky2.execute-api.us-east-1.amazonaws.com/production",
  });

  const postCalls = [...activeConnections].map(async (connectionId) => {
    try {
      await apigatewayManagementApi
        .postToConnection({
          ConnectionId: connectionId,
          Data:JSON.stringify(message),
        })
        .promise();
    } catch (error) {
      // Handle errors if needed
      console.error(`Failed to send message to connection ${connectionId}`, error);
    }
  });

  await Promise.all(postCalls);
};

exports.handler = async (event) => {
  const connectionId = event.requestContext.connectionId;
  const routeKey = event.requestContext.routeKey;
  let body = {};
  try {
    if (event.body) {
      body = JSON.parse(event.body);
    }
  } catch (err) {
    console.error('Error parsing event body', err);
    return { statusCode: 400, body: 'Bad Request: Invalid JSON in the event body' };
  }

  const handlePlayerConnect = async () => {
    activeConnections.add(connectionId);
  };

  const handlePlayerDisconnect = async () => {
    const message = `${names[connectionId]} Left the chat`;
  delete names[connectionId]; // Remove the disconnected user's name
  activeConnections.delete(connectionId);
  await broadcastMessage(message);
  };

  const handleSetName = async(body) =>{
    names[connectionId] = body.name;
    const message = `${names[connectionId]} Joined the chat`;
    broadcastMessage(message)
  }

  //socket route
  switch (routeKey) {
    case '$connect':
      await handlePlayerConnect();
      break;
    case '$disconnect':
      await handlePlayerDisconnect();
      break;
    case 'setName':
      handleSetName(body)
      break;
    case 'sendPublic':
      message = `${names[connectionId]} : ${body.message}`;
      broadcastMessage(message)
    
      break;
    default:
      console.warn(`Unsupported route: ${routeKey}`);
  }

  return { statusCode: 200, body: 'Success' };
};

//Reference 
//https://www.youtube.com/watch?v=BcWD-M2PJ-8&t=1231s