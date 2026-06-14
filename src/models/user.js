const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String , required: true , trim: true},
    email: {type: String , required: true , unique: true , lowercase : true},
    password: {type : String , required: true , select: false},
    avatar: {type: String , required: false},
}, { timestamps: true })

userSchema.pre('save', async function(next) {
  if(!this.isModified('password')){
    return next();
  }

  const salt = await bcryptjs.genSalt(10)
  this.password = await bcryptjs.hash(this.password , salt);
  next();
})

userSchema.methods.comparePasswords = async function(enteredPassword) {
  const isMatch = await bcryptjs.compare(enteredPassword, this.password);
  return isMatch
}

const User = mongoose.model('User' , userSchema)
module.exports = User