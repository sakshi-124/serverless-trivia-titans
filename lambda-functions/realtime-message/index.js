const express = require('express');
const http = require('http');
const cors = require('cors');


const app = express();
const server = http.createServer(app);
app.use(cors);
  
const io = require('socket.io')(server , {
    pingTimeout : 60000,
    cors : {
        origin : "*",
        methods : ["GET" , "POST"]
    },

});


io.on('connection', (socket) => {
  console.log('connected. to socket io');

  // Handle incoming messages from the client
  socket.on('setup', (userData) => {
    // Broadcast the message to all connected clients
    socket.join(userData.email)
    console.log(userData.email)
    io.emit("connected");
  });

  socket.on('join chat' , (room) =>{
    console.log("joined room" + room)
  });

  // Handle disconnections
//   socket.on('disconnect', () => {
//     console.log('User disconnected.');
//   });
});

const port = 5000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
