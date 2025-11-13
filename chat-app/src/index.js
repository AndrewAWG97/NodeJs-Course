// ======================================
//             IMPORTS
// ======================================
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import leoProfanity from 'leo-profanity';
const { clean } = leoProfanity;

import { generateMessage, generateLocationMessage } from './utils/messages.js';
import { addUser, removeUser, getUser, getUsersInRoom } from './utils/users.js';

// ======================================
//    PATH SETUP (Required for ES Modules)
// ======================================
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ======================================
//             EXPRESS + SOCKET.IO
// ======================================
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve public folder
app.use(express.static(path.join(__dirname, '../public')));

// Load profanity dictionary
leoProfanity.loadDictionary();


// ======================================
//        SOCKET.IO CONNECTION HANDLER
// ======================================
io.on('connection', (socket) => {
  console.log('🔥 New WebSocket connection:', socket.id);

  // ===============================
  //       JOINING A ROOM
  // ===============================
  socket.on('join', ({ username, room }, callback) => {
    // Add user to our in-memory list
    const { error, user } = addUser({ id: socket.id, username, room });

    // If username is taken or data invalid
    if (error) {
      return callback(error);
    }

    // Physically join Socket.IO room
    socket.join(user.room);

    // Store username + room ON the socket (convenient)
    socket.username = user.username;
    socket.room = user.room;

    // Welcome message to current user only
    socket.emit('message', generateMessage('Admin', `Welcome ${user.username}!`));

    // Notify other users in the room
    socket.broadcast
      .to(user.room)
      .emit('message', generateMessage('Admin', `${user.username} has joined the room.`));

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room)
    })
    // Everything OK
    callback();

    // Optionally: send room data (for sidebar)
    // io.to(user.room).emit('roomData', {
    //   room: user.room,
    //   users: getUsersInRoom(user.room),
    // });
  });



  // ===============================
  //       SENDING A MESSAGE
  // ===============================
  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    if (!user) return callback('User not found.');
    if (!message) return callback();

    // Clean profanity automatically
    const cleaned = leoProfanity.clean(message);

    // Emit to USERS ONLY in the same room
    io.to(user.room).emit(
      'message',
      generateMessage(user.username, cleaned)
    );

    callback(
      leoProfanity.check(message)
        ? '⚠️ Message cleaned (bad words filtered).'
        : '✅ Message delivered.'
    );
  });



  // ===============================
  //       SENDING LOCATION
  // ===============================
  socket.on('sendLocation', (coords, callback) => {
    const user = getUser(socket.id)
    if (!user) return callback('User not found.')

    const url = `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`

    io.to(user.room).emit(
      'locationMessage',
      generateLocationMessage(user.username, url)
    )

    callback('📍 Location shared!')
  })


  // ===============================
  //       USER DISCONNECTS
  // ===============================
  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      // Let room know user left
      io.to(user.room).emit(
        'message',
        generateMessage('Admin', `${user.username} has left the room.`)
      );

        io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room)
    })
      // Update sidebar (optional)
      // io.to(user.room).emit('roomData', {
      //   room: user.room,
      //   users: getUsersInRoom(user.room),
      // });
    }
  });
});


// ======================================
//             START SERVER
// ======================================
const PORT = 3000;
server.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
