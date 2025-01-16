// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { getSocket, disconnectSocket } from './socket'; // Import socket utilities
// import './Chat.css';
// import InfoBar from '../InfoBar/InfoBar';
// import Input from '../Input/Input';
// import Messages from '../Messages/Messages';
// export default function Chat() {
//   const location = useLocation();
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState('');

//   const searchParams = new URLSearchParams(location.search);
//   const name = searchParams.get('name');
//   const room = searchParams.get('room');

//   useEffect(() => {
//   console.log('Chat component mounted');
//   return () => {
//     console.log('Chat component unmounted');
//   };
// }, []);

// const socket = getSocket(); // Get the single socket instance
//   useEffect(() => {
//     console.log('Socket connected or updated!');
//     socket.emit('join', { name, room }, (error) => {
//       if (error) {
//         console.error(error);
//       }
//     });

//     return () => {
//       console.log('Cleaning up...');
//       socket.emit('disconnection');
//       socket.off(); // Remove all listeners
//     };
//   }, [socket, name, room]);

//   useEffect(() => {
//     socket.on('message', (message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });
//   }, [socket]);

//   const sendMessage = (event) => {
//     event.preventDefault();
//     if (message) {
//       socket.emit('sendMessage', message, () => {
//         setMessage('');
//       });
//     }
//   };

//   console.log('Messages:', messages);

//     return (
//     <div className="outerContainer">
//       <div className="container">
        
//         <InfoBar room={room}/>
//         <Messages messages = {messages} name = {name}/>
//         <Input message={message} setMessage={setMessage} sendMessage={sendMessage}/>
//         {/* <input
//           value={message}
//           onChange={(event) => setMessage(event.target.value)}
//           onKeyPress={(event) => (event.key === 'Enter' ? sendMessage(event) : null)}
//           placeholder="Type a message"
//         />
//         <div className="messageContainer">
//           {messages.map((msg, index) => (
//             <div key={index}>
//               <strong>{msg.user}</strong>: {msg.text}
//             </div>
//           ))}
//         </div>*/}
//       </div> 
//     </div>
//   );


// }


import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getSocket, disconnectSocket } from './socket'; // Import socket utilities
import './Chat.css';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';

export default function Chat() {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

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
    </div>
  );
}
