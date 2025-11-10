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

io.on('connection', ()=>{
    console.log("New Websocket connection")
})

server.listen(port, () => {
  console.log(`🚀 Server is up on port ${port}`);
});