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

  // socket.on('join', ({ name, room },callback) => {

  //   const name1 = name.trim().toLowerCase();
  //   const room1 = room.trim().toLowerCase();

  //   console.log("Data");
  //   console.log(name1,room1);

  //   const {error,user} = addUser(socket.id,name1,room1);
   
  //   if(error){
  //     return callback(error);
  //   }

  //   socket.emit('message', {user:'admin',text:`${user.name} welcome to room ${user.room}`});
  //   socket.broadcast.to(user.room).emit('message',{user:'admin',text:`${user.name}, has joined`});
  //   socket.join(room);

  //   callback();
    
  // });

  socket.on('join', ({ name, room }, callback) => {
  const name1 = name.trim().toLowerCase();
  const room1 = room.trim().toLowerCase();


  console.log("Data");
  console.log(name1, room1);

  const { error, user } = addUser({
    id: socket.id,
    name: name1,
    room: room1
  });

  if (error) {
    return callback(error);
  }

  socket.emit('message', { user: 'admin', text: `${user.name} welcome to room ${user.room}` });
  socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined` });
  socket.join(room1);

  callback();
});


  // Handle user sending a message
  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    console.log("SendMessage Event:");
    console.log("Socket ID:", socket.id);
    console.log("User Retrieved:", user);

    if (!user) {
      console.error("Error: User not found for socket ID", socket.id);
      return callback("User not found.");
    }

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('disconnection', () => {
    console.log('User Had Left!!!');
  });
});

server.listen(5000, () => {
  console.log('Server Started on Port 5000');
});
