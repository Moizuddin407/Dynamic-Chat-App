const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const cors = require('cors');

const router = require('./router');
const {addUser,removeUser,getUser,getUsersInRoom} = require('./users');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Replace with your React app URL
    methods: ['GET', 'POST'],
  },
});

app.use(cors());
app.use(router);



io.on('connection', (socket) => {
  console.log('We have a new connection ! ! !');

  // Reconnect logic (on page reload)
  socket.on('join', ({ name, room }, callback) => {
    const name1 = name.trim().toLowerCase();
    const room1 = room.trim().toLowerCase();

    console.log("Data");
    console.log(name1, room1);

    const { error, user } = addUser({
      id: socket.id,
      name: name1,
      room: room1,
    });

    if (error) {
      return callback(error);
    }

    socket.emit('message', { user: 'admin', text: `${user.name} welcome to room ${user.room}` });
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined` });
    socket.join(user.room); // Join the correct room

    io.to(user.room).emit('roomData',{room:user.room,users:getUsersInRoom(user.room)})

    callback();
  });

  // Handle sending message logic
  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', { user: user.name, text: message });
            io.to(user.room).emit('roomData', { user: user.room, users: getUsersInRoom(user.room) });
    } else {
      console.error('User not found!');
    }

    callback();
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left` });
    }
  });
});


server.listen(5000, () => {
  console.log('Server Started on Port 5000');
});
