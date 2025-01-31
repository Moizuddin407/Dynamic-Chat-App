// socket.js
import io from 'socket.io-client';

let socket;

export const getSocket = () => {
  if (!socket) {
    console.log('Creating new socket instance');
    socket = io('http://localhost:5000'); // Only create once
  } else {
    console.log('Using existing socket instance');
  }
  return socket;
};


export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
