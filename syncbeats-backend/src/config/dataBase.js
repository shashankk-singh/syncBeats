const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    
  } catch (err) {
    console.log('Connection Failed ' , err)
    process.exit(1) //kill the app immediately
  }
}

module.exports = connectDB