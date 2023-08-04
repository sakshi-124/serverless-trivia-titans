const AWS = require('aws-sdk');
const activeConnections = new Set();
let gameData = {};
let gameTime = {}; 

//method to broadcast all messages. 
const broadcastMessage = async (message) => {
  const apigatewayManagementApi = new AWS.ApiGatewayManagementApi({
    endpoint: "bmwi4srqef.execute-api.us-east-1.amazonaws.com/production",
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
      console.error(`Failed to send message to connection ${connectionId}`, error);
    }
  });

  await Promise.all(postCalls);
};

//lambda handler
exports.handler = async (event) => {
  const connectionId = event.requestContext.connectionId;
  const routeKey = event.requestContext.routeKey;
  let body = {};
  let player = "";
  try {
    if (event.body) {
      body = JSON.parse(event.body);
    }
    if(event.player)
    {
      player = JSON.parse(event.player)
    }
    
  } catch (err) {
    console.error('Error parsing event body', err);
    return { statusCode: 400, body: 'Bad Request: Invalid JSON in the event body' };
  }

  // Function to handle player connections
  const handlePlayerConnect = async () => {
    activeConnections.add(connectionId);
  };

  // Function to handle player disconnections
  const handlePlayerDisconnect = async () => {
    activeConnections.delete(connectionId);
  };

  const handleGameData = async (body) => {
      gameData = body;
      await broadcastMessage(gameData);
      
  };

  switch (routeKey) {
    case '$connect':
      await handlePlayerConnect();
      break;
    case '$disconnect':
      await handlePlayerDisconnect();
      break;
    case 'gameData':
      await handleGameData(body);
      break;
    case 'submitAns':
      const message = {
  option: body,
  player: player,
};
      await broadcastMessage(body);
      break;
    case 'setTime':
      await broadcastMessage(body);
      break;
    case 'submitScore':
      await broadcastMessage(body);
      break;
        case 'submitScore':
      await broadcastMessage(body);
      break;
        case 'submitNavigation':
      await broadcastMessage(body);
      break;
    default:
      console.warn(`Unsupported route: ${routeKey}`);
  }
  return { statusCode: 200, body: 'Success' };
};
