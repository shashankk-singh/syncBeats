app.set('trust proxy', 1)
require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const authRoutes = require('./src/routes/auth')
const roomRoutes = require('./src/routes/room')
const initSockets = require('./src/sockets/index')
const connectDB = require('./src/config/dataBase')
const mongoSanitize = require('express-mongo-sanitize')
const { rateLimit } = require('express-rate-limit')
const helmet = require('helmet')


//wrapping the express app for sockets.io since they supports native Node HTTP server
const { createServer } = require('http');
const { Server } = require('socket.io');

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});



const allowedOrigins = process.env.FRONTEND_URLS?.split(',') || ['http://localhost:5173']

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

app.use(helmet());
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
});

app.use(express.json());
app.use(cors({
   origin: allowedOrigins,
   credentials: true
}))
app.use(globalLimiter)
app.use(cookieParser());
app.use((req, res, next) => {
  req.body = mongoSanitize.sanitize(req.body)
  next()
})
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);


initSockets(io)
connectDB().then(() => {
  httpServer.listen(port, () => {
    console.log(`
    ╔════════════════════════════════════════╗
    ║                                        ║
    ║       🎵  SyncBeats                    ║
    ║                                        ║
    ║       Port    → ${port}                   ║
    ║       Mode    → ${process.env.NODE_ENV || 'development'}            ║
    ║       Status  → Ready                  ║
    ║       MongoDB → Ready                  ║
    ║                                        ║
    ║                                        ║
    ╚════════════════════════════════════════╝
  `)
  })
})