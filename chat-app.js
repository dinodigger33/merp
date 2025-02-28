const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve the chat UI from a string
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Chat App</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                }
                #messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 10px;
                    border-bottom: 1px solid #ccc;
                }
                form {
                    display: flex;
                    padding: 10px;
                    background: #f9f9f9;
                }
                input {
                    flex: 1;
                    padding: 10px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                }
                button {
                    padding: 10px;
                    border: none;
                    background: #007BFF;
                    color: white;
                    border-radius: 5px;
                    margin-left: 10px;
                    cursor: pointer;
                }
            </style>
        </head>
        <body>
            <div id="messages"></div>
            <form id="form">
                <input id="input" autocomplete="off" placeholder="Type a message..." />
                <button>Send</button>
            </form>
            <script src="/socket.io/socket.io.js"></script>
            <script>
                const socket = io();
                const form = document.getElementById('form');
                const input = document.getElementById('input');
                const messages = document.getElementById('messages');

                // Send message on form submit
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    if (input.value) {
                        socket.emit('chat message', input.value);
                        input.value = '';
                    }
                });

                // Append incoming messages
                socket.on('chat message', (msg) => {
                    const item = document.createElement('div');
                    item.textContent = msg;
                    messages.appendChild(item);
                    messages.scrollTop = messages.scrollHeight; // Auto-scroll to the latest message
                });
            </script>
        </body>
        </html>
    `);
});

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected');

    // Broadcast incoming messages to all connected users
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    // Handle user disconnects
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Chat app is running at http://localhost:${PORT}`);
});
node chat-app.js
