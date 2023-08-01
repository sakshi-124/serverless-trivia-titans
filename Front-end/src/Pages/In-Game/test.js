const AWS = require('aws-sdk')

const ENDPOINT = 'r6s5zxfky2.execute-api.us-east-1.amazonaws.com/production'
const client =  new AWS.ApiGatewayManagementApi({
  endpoint : ENDPOINT
});

const names = {};

const sendToOne = async (id ,body) =>{
  
  try {
    /* code */
    client.postToConnection({
      'ConnectionId' : id,
      'Data' : Buffer.from(JSON.stringify(body))
    }).promise();
  } catch (e) {
    console.log(e)
  }
}

const sendToAll = async (ids, body) =>{
  const all = ids.map(i =>sendToOne(i , body));
  return Promise.all(all);
  
}
exports.handler = async (event) => {
  
  // TODO implement
  
  if (event.requestContext) {
    const connectionId= event.requestContext.connectionId;
    const routeKey = event.requestContext.routeKey;
    
    let body = {};
    
    try
    {
      if(event.body)
      {
        body = JSON.parse(event.body)
      }
    }
    catch(err){
      
    }
  
    
    switch (routeKey) {
      case '$connect':
        // code
        break;
         case '$disconnect':
        // code
        await sendToAll(Object.keys(names),{System : `${names[connectionId]} has left the chat`})
        delete names[connectionId]
        await sendToAll(Object.keys(names) , {members : Object.values(names)});
        
        break;
         case 'setName':
        // code
        names[connectionId] = body.name;
         await sendToAll(Object.keys(names) , {members : Object.values(names)});
         await sendToAll(Object.keys(names),{System : `${names[connectionId]} has joined the chat`});
        break;
         case '$default':
        // code
        break;
         case 'sendPublic':
        // code
        await sendToAll(Object.keys(names),{message : `${names[connectionId]} : ${body.message}` , sender : `${names[connectionId]}`});
        break;
         case 'sendPrivate':
        // code
        const to = Object.keys(names).find(key => names[key] === body.to);
        await sendToOne(to , {privateMsg :`${names[connectionId]} : ${body.message}` })
        break;
      
      default:
        // code
    }
    
  }
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  return response;
};
