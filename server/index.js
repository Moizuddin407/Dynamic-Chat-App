const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

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

// Debugging middleware for HTTP requests
app.use((req, res, next) => {
  console.log(`[HTTP] ${req.method} ${req.url}`);
  next();
});

// Handle favicon requests (to avoid 404s)
app.get('/favicon.ico', (req, res) => {
  res.sendFile(path.join(__dirname, 'favicon.ico'));
});

// Add a default route for testing
app.get('/', (req, res) => {
  console.log(`[INFO] Root route accessed`);
  res.send('Backend is working!');
});

// Socket.io logic
io.on('connection', (socket) => {
  console.log(`[SOCKET] New connection: ${socket.id}`);

  // Handle join event
  socket.on('join', ({ name, room }, callback) => {
    console.log(`[SOCKET] Join event: Name=${name}, Room=${room}`);
    const name1 = name.trim().toLowerCase();
    const room1 = room.trim().toLowerCase();

    const { error, user } = addUser({ id: socket.id, name: name1, room: room1 });

    if (error) {
      console.error(`[ERROR] ${error}`);
      return callback(error);
    }

    console.log(`[SOCKET] User joined room: ${room1}`);
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
    console.log(`[SOCKET] Message event from ${socket.id}: ${message}`);

    if (user) {
      io.to(user.room).emit('message', { user: user.name, text: message });
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    } else {
      console.error('[ERROR] User not found for message event');
    }

    callback();
  });

  // Handle disconnect event
  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    console.log(`[SOCKET] Disconnection: ${socket.id}`);
    if (user) {
      console.log(`[SOCKET] User left room: ${user.room}`);
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
