const express = require('express');
const socketio = require('socket.io');
const http = require('http')

const port = process.env.PORT || 5000;

// Setting up socket.
// Creates app
const app = express();
// lets app talk to internet
const server = http.createServer(app);
// adds real-time communication.
const io = socketio(server);

// For connection.
io.on('connection', (socket) =>{
    console.log('New Connection Made ! ! !');

    socket.on('disconnect',()=>{
        console.log('User left');
    })
})


// Routes
const router = require('./router');
app.use(router);


server.listen(port, () => {
    console.log(`Server Started on Port ${port}`)
})