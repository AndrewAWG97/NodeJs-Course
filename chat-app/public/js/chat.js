const socket = io();
console.log('Chat.js loaded');
// 1️⃣ Listen for the 'countUpdated' event coming from the server
socket.on('countUpdated', (countFromIndex) => {
    console.log('The count has been updated', countFromIndex);
});

// 2️⃣ When the button with id="increment" is clicked...
document.querySelector('#incrementButton').addEventListener('click', () => {
    console.log('Clicked');
    // 3️⃣ Send an 'increment' event to the server
    socket.emit('increment');
});