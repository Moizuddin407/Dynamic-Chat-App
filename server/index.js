const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const router = require('./router');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const app = express();
const server = createServer(app);

// Configure CORS
const io = new Server(server, {
  cors: {
    origin: 'https://dynamic-chat-app-client.vercel.app', // Replace with your React app URL
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(router);

// Socket.io logic
io.on('connection', (socket) => {
  console.log('We have a new connection!');

  // Handle join event
  socket.on('join', ({ name, room }, callback) => {
    const name1 = name.trim().toLowerCase();
    const room1 = room.trim().toLowerCase();

    const { error, user } = addUser({ id: socket.id, name: name1, room: room1 });

    if (error) return callback(error);

    socket.emit('message', {
      user: 'admin',
      text: `${user.name}, welcome to room ${user.room}!`,
    });
    socket.broadcast.to(user.room).emit('message', {
      user: 'admin',
      text: `${user.name} has joined!`,
    });
    socket.join(user.room);

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  // Handle sendMessage event
  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', { user: user.name, text: message });
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    } else {
      console.error('User not found!');
    }

    callback();
  });

  // Handle disconnect event
  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', {
        user: 'admin',
        text: `${user.name} has left.`,
      });
    }
  });
});

// Export the handler for Vercel
module.exports = (req, res) => {
  server.emit('request', req, res);
};
