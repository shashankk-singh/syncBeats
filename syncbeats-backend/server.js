require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000
const mongoose = require('mongoose');
const cors = require('cors')
const authRoutes = require('./src/routes/auth')
const roomRoutes = require('./src/routes/room')
const initSockets = require('./src/sockets/index')
const connectDB = require('./src/config/dataBase');

//wrapping the express app for sockets.io since they supports native Node HTTP server
const { createServer } = require('http');
const { Server } = require('socket.io');

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});



app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
});

app.use(express.json());
app.use(cors())
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

initSockets(io)
connectDB().then(() => {
  httpServer.listen(port , () => {
    console.log(`Server is listening on port ${port}...`)
  })
})