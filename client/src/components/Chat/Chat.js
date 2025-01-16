import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getSocket, disconnectSocket } from './socket'; // Import socket utilities
import './Chat.css';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer'

export default function Chat() {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState('');

  const searchParams = new URLSearchParams(location.search);
  const name = searchParams.get('name');
  const room = searchParams.get('room');

  const socket = getSocket(); // Get the single socket instance

  // useEffect(() => {
  //   console.log('Chat component mounted');

  //   socket.emit('join', { name, room }, (error) => {
  //     if (error) {
  //       console.error(error);
  //     }
  //   });

  //   // Cleanup function
  //   return () => {
  //     console.log('Chat component unmounted');
  //     socket.emit('disconnection');
  //     socket.off(); // Remove all event listeners
  //   };
  // }, [socket, name, room]); // Empty array to ensure this runs only once when the component is mounted

  useEffect(() => {
  console.log('Chat component mounted');

  socket.emit('join', { name, room }, (error) => {
    if (error) {
      console.error(error);
    }
  });

  // Cleanup function
  return () => {
    console.log('Chat component unmounted');
    socket.emit('disconnection');
    socket.off(); // Remove all event listeners
  };
}, [socket, name, room]); // Ensure this only triggers on mount

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });

    // Return cleanup function to remove the listener on unmount
    return () => {
      socket.off('message');
    };
  }, [socket]); // Only need to set up the listener once

  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      socket.emit('sendMessage', message, () => {
        setMessage('');
      });
    }
  };

  return (
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />

      </div>
      <TextContainer users={users}/>
    </div>
  );
}
