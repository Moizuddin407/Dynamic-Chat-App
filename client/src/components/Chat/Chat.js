import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import './Chat.css'; // Ensure you have the appropriate styles

const socket = io('http://localhost:5000'); // Replace with your backend URL

export default function Chat() {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  const searchParams = new URLSearchParams(location.search);
  const name = searchParams.get('name');
  const room = searchParams.get('room');

  useEffect(() => {
    socket.emit('joinRoom', { name, room });

    socket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [name, room]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message) {
      socket.emit('sendMessage', { room, message, name });
      setMessage('');
    }
  };

  return (
    <div className="chatOuterContainer">
      <div className="chatInnerContainer">
        <div className="messageContainer">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              <p>{msg}</p>
            </div>
          ))}
        </div>
        <form className="form" onSubmit={sendMessage}>
          <input
            className="messageInput"
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="sendButton" type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}
