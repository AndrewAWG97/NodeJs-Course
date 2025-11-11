// ==========================================
// 🌐 SIMPLE CHAT SERVER WITH LOCATION SHARING
// ==========================================

import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import leoProfanity from 'leo-profanity';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ------------------------------------------
// 🔧 ESM setup (__dirname replacement)
// ------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ------------------------------------------
// 🧩 Server Setup
// ------------------------------------------
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, '../public')));

// Load English profanity dictionary
leoProfanity.loadDictionary();

// ------------------------------------------
// 💬 Socket.IO Logic
// ------------------------------------------
io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // Send welcome message
  socket.emit('message', {
    text: 'Welcome to the chat!',
    senderId: 'Server',
    createdAt: new Date().toISOString(),
  });

  // Notify others
  socket.broadcast.emit('message', {
    text: 'A new user joined the chat!',
    senderId: 'Server',
    createdAt: new Date().toISOString(),
  });

  // ---- Handle text messages ----
  socket.on('sendMessage', (messageText, callback) => {
    const cleanedText = leoProfanity.clean(messageText);

    io.emit('message', {
      text: cleanedText,
      senderId: socket.id,
      createdAt: new Date().toISOString(),
    });

    if (leoProfanity.check(messageText)) {
      callback('⚠️ Your message contained profanity and was auto-cleaned.');
    } else {
      callback('✅ Message delivered successfully!');
    }
  });

  // ---- Handle location sharing ----
  socket.on('sendLocation', ({ latitude, longitude }, callback) => {
    const locationUrl = `https://www.google.com/maps/search/${latitude},${longitude}`;

    io.emit('message', {
      text: `📍 Shared location: ${locationUrl}`,
      senderId: socket.id,
      createdAt: new Date().toISOString(),
    });

    callback('✅ Location shared successfully!');
  });

  // ---- Handle disconnect ----
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
    io.emit('message', {
      text: 'A user has left the chat.',
      senderId: 'Server',
      createdAt: new Date().toISOString(),
    });
  });
});

// ------------------------------------------
// 🚀 Start Server
// ------------------------------------------
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
