const bcryptjs = require('bcryptjs');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String , required: true , trim: true},
    email: {type: String , required: true , unique: true , lowercase : true},
    password: {type : String , required: true , select: false},
    avatar: {type: String , required: false},
}, { timestamps: true })

userSchema.pre('save', async function() {
  if(!this.isModified('password')){
    return
  }

  const salt = await bcryptjs.genSalt(10)
  this.password = await bcryptjs.hash(this.password , salt);
})

userSchema.methods.comparePasswords = async function(enteredPassword) {
  const isMatch = await bcryptjs.compare(enteredPassword, this.password);
  return isMatch
}

const User = mongoose.model('User' , userSchema)
module.exports = User