// import React, { useEffect, useState } from 'react';
// import io from 'socket.io-client';
// import { useLocation } from 'react-router-dom';
// import './Chat.css'; // Ensure you have the appropriate styles

// let socket; // Declare socket globally outside the component

// export default function Chat() {
//   const ENDPOINT = 'http://localhost:5000'; // Replace with your backend URL
//   const location = useLocation();
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState('');

//   const searchParams = new URLSearchParams(location.search);
//   const name = searchParams.get('name');
//   const room = searchParams.get('room');

//   useEffect(() => {
//     // Initialize socket connection only once
//     socket = io(ENDPOINT); // Create the socket connection

//     // Emit join event
//     socket.emit('join', { name, room }, (error) => {
//       if (error) {
//         console.error(error);
//       }
//     });

//     // Clean up socket connection on component unmount
//     return () => {
//       socket.emit('disconnection');
//       socket.off();
//     };
//   }, [ENDPOINT, name, room]); // Dependencies ensure this runs only once

//   useEffect(() => {
//     // Listen for messages from the server
//     socket.on('message', (message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });
//   }, []); // Empty dependency array ensures this runs only once

//   // Function to send messages
//   const sendMessage = (event) => {
//     event.preventDefault();
//     if (message) {
//       socket.emit('sendMessage', message, () => {
//         setMessage('');
//       });
//     }
//   };

//   console.log('Messages:', messages);

//   return (
//     <div className="outerContainer">
//       <div className="container">
//         <input
//           value={message}
//           onChange={(event) => setMessage(event.target.value)}
//           onKeyPress={(event) => (event.key === 'Enter' ? sendMessage(event) : null)}
//         />
//         <div className="messageContainer">
//           {messages.map((msg, index) => (
//             <div key={index}>
//               <strong>{msg.user}</strong>: {msg.text}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getSocket, disconnectSocket } from './socket'; // Import socket utilities
import './Chat.css';

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
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyPress={(event) => (event.key === 'Enter' ? sendMessage(event) : null)}
        />
        <div className="messageContainer">
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.user}</strong>: {msg.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
