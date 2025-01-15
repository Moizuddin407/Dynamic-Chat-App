const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Replace with your React app URL
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

io.on('connection', (socket) => {
  console.log('New Connection Made ! ! !');

  socket.on('joinRoom', ({ name, room }) => {
    socket.join(room);

    // Notify the room about the new user
    io.to(room).emit('message', `${name} has joined the room`);
    console.log(`User ${name} joined room ${room}`);
  });

  socket.on('sendMessage', ({ room, message, name }) => {
    io.to(room).emit('message', `${name}: ${message}`);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected');
  });
});

server.listen(5000, () => {
  console.log('Server Started on Port 5000');
});
