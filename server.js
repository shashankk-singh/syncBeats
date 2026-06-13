require('dotenv').config();
const express = require('express');
const app = express();
const port = 5000
const mongoose = require('mongoose');

app.get('/health', (req, res) => {
  res.status(200).json({ "status": "okay" });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});