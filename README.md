# Chat App

A real-time chat application built using **Express**, **Node.js**, and **React**. This project utilizes **Socket.IO** for real-time communication and includes features such as emoji support, user-friendly chat UI, and a smooth scrolling experience.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [Design Pattern](#design-pattern)
- [Credits](#credits)

## Installation

### Prerequisites
Make sure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** (v6 or higher)

### Steps

1. Clone the repository to your local machine:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the **client** folder:
   ```bash
   cd client
   ```

3. Install the client-side dependencies:
   ```bash
   npm install
   ```

4. Navigate to the **server** folder:
   ```bash
   cd ../server
   ```

5. Install the server-side dependencies:
   ```bash
   npm install
   ```

6. Start both the client and the server:
   - Start the server:
     ```bash
     npm run dev
     ```
   - Start the client:
     ```bash
     npm start
     ```

Both the client and server should now be running on their respective ports. You can start chatting with other users.

## Usage

Once the application is running, open your browser and navigate to `http://localhost:3000` to start chatting.

### Key Features:
- **Real-Time Messaging**: Powered by **Socket.IO** for instant message exchange.
- **Emoji Support**: Integrated **Emoji Mart** for adding emojis to chat messages.
- **Smooth Scroll**: Use **react-scroll-to-bottom** to ensure smooth chat message scrolling.
- **Dynamic Routing**: Use **react-router-dom** for seamless navigation between different chat rooms.

## Dependencies

### Client-side
```json
{
  "dependencies": {
    "cra-template": "1.2.0",
    "emoji-mart": "^5.6.0",
    "query-string": "^9.1.1",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.1.1",
    "react-scripts": "5.0.1",
    "react-scroll-to-bottom": "^4.2.0",
    "socket.io-client": "^4.8.1",
    "web-vitals": "^4.2.4"
  }
}
```

### Server-side
```json
{
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.21.2",
    "nodemon": "^3.1.9",
    "socket.io": "^4.8.1"
  }
}
```

## Design Pattern

The **Singleton Pattern** is applied in the chat app's socket connection management. This ensures that only a single instance of the socket connection exists throughout the entire lifecycle of the app, preventing the creation of multiple socket instances and ensuring optimal resource usage.

- The singleton pattern is used in both the client and server code to guarantee that there is only one connection to the server at a time.
- On the client side, a socket connection is created once and reused across the application.
- On the server side, the socket connection is created and managed through a single instance, ensuring that messages are handled consistently and efficiently across all connected clients.

### Client Code Example:
```javascript
let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io.connect("http://localhost:5000");
  }
  return socket;
};
```

### Server Code Example:
```javascript
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

let socketInstance;

io.on("connection", (socket) => {
  if (!socketInstance) {
    socketInstance = socket;
  }

  socket.on("message", (data) => {
    socketInstance.emit("message", data);
  });
});
```

## Credits

Special thanks to [this YouTube tutorial](https://www.youtube.com/watch?v=ZwFA3YMfkoc) for getting the basic structure of this chat app up and running.

> Please note that the code differs from the tutorial as it has been updated to reflect the latest advancements in **React**, **Socket.IO**, and **Express** libraries.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
```
