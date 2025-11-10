const express = require('express');
const http = require('http')
const path = require('path');
const socketio = require('socket.io')

const app = express();
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

let count = 0;

io.on('connection', (socket) => {
    console.log("New WebSocket connection");

    // 1️⃣ When a new browser connects, send it the current count
    socket.emit('countUpdated', count);

    // 2️⃣ Wait for the client to send an 'increment' event
    socket.on('increment', () => {
        console.log('Received increment event');
        count++;
        // socket.emit('countUpdated', count);
        io.emit('countUpdated', count)
    });
});
server.listen(port, () => {
    console.log(`🚀 Server is up on port ${port}`);
});