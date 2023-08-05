// Author : Sakshi Chaitanya Vaidya
// B00917159
// Sakshi.Vaidya@dal.ca

const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
app.use(cors());

const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
});

const users = [];

io.on('connection', (socket) => {
  console.log('connected to socket.io');

  socket.on('setup', (userData) => {
    console.log(userData);
    socket.join(userData.email);
    console.log(userData.email);

    users.push(userData);
    io.emit('userJoined', userData.name);

    const userList = users.map(user => user.name);
    socket.emit('userList', userList);

    socket.broadcast.emit('userJoined', userData.name);
  });

  socket.on('joinChat', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on('newMessage', (messageData) => {
    socket.to(messageData.room).emit('messageReceived', {
      text: messageData.text,
      name: users.find(user => user.email === messageData.sender).name
    });
  });

  socket.on('disconnect', () => {
    const index = users.findIndex(user => user.id === socket.id);
    if (index !== -1) {
      const disconnectedUser = users.splice(index, 1)[0];
      io.emit('userLeft', disconnectedUser.name);
    }
    console.log('User disconnected.');
  });
});

const port = 5000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// reference

//https://socket.io/
