require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000
const mongoose = require('mongoose');
const cors = require('cors')
const authRoutes = require('./src/routes/auth')
const connectDB = require('./src/config/dataBase');

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
});

app.use(express.json());
app.use(cors())
app.use('/api/auth', authRoutes);


connectDB().then(() => {
  app.listen(port , () => {
    console.log(`Sever is listening on port ${port}...`)
  })
})