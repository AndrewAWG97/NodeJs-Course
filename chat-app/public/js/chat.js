const socket = io();  // connect to server

const form = document.querySelector('#messageForm');
const input = document.querySelector('#messageInput');
const messages = document.querySelector('#messages');

// When we receive a message from the server
socket.on('message', (msg) => {
  if (msg.senderId === socket.id) {
    console.log('🟢 You:', msg.text);
  } else {
    console.log(`🔵 ${msg.senderId}:`, msg.text);
  }
});


// When the form is submitted
form.addEventListener('submit', (e) => {
  e.preventDefault();          // prevent page reload which default behavior
  const message = e.target.elements.message.value;
  if (message.trim() === '') return;
  socket.emit('sendMessage', message);  // send to server
  e.target.elements.message.value = '';                     // clear input
});
