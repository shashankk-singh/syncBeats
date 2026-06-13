require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 5000
const mongoose = require('mongoose');
const connectDB = require('./src/config/dataBase');

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' })
});


connectDB().then(() => {
  app.listen(port , () => {
    console.log(`Sever is listening on port ${port}...`)
  })
})