import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getSocket, disconnectSocket } from './socket'; // Import socket utilities
import './Chat.css';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

export default function Chat() {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const searchParams = new URLSearchParams(location.search);
  const name = searchParams.get('name');
  const room = searchParams.get('room');

  useEffect(() => {
  console.log('Chat component mounted');
  return () => {
    console.log('Chat component unmounted');
  };
}, []);

const socket = getSocket(); // Get the single socket instance
  useEffect(() => {
    console.log('Socket connected or updated!');
    socket.emit('join', { name, room }, (error) => {
      if (error) {
        console.error(error);
      }
    });

    return () => {
      console.log('Cleaning up...');
      socket.emit('disconnection');
      socket.off(); // Remove all listeners
    };
  }, [socket, name, room]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }, [socket]);

  const sendMessage = (event) => {
    event.preventDefault();
    if (message) {
      socket.emit('sendMessage', message, () => {
        setMessage('');
      });
    }
  };

  console.log('Messages:', messages);

    return (
    <div className="outerContainer">
      <div className="container">
        
        <InfoBar room={room}/>
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
        {/* <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyPress={(event) => (event.key === 'Enter' ? sendMessage(event) : null)}
          placeholder="Type a message"
        />
        <div className="messageContainer">
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.user}</strong>: {msg.text}
            </div>
          ))}
        </div> */}
      </div>
    </div>
  );


}
