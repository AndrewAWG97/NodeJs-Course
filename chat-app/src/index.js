const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);     // HTTP server for Express
const io = socketio(server);               // Attach Socket.IO to the same server

// Serve static files from "public" folder
app.use(express.static(path.join(__dirname, '../public')));

// When a new client connects
io.on('connection', (socket) => {
    console.log('A user connected');

    // Send a welcome message to the new user
    socket.emit('message', 'Welcome to the chat!');

    // When a user sends a message
    socket.on('sendMessage', (msg) => {
        // Build a message object with both text and sender ID
        const data = {
            text: msg,
            senderId: socket.id
        };

        // Send it to everyone (including the sender)
        io.emit('message', data);
    });

    // When the user disconnects
    socket.on('disconnect', () => {
        console.log(socket.id + 'User disconnected');
    });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
