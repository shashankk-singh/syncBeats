const User = require('../models/user.js')
const generateToken = require('../utils/generateToken.js')


const signup = async (req, res) => {
    try {
        const {name, email, password} = req.body

        if(await User.findOne({email})){ // check fro existingUser
            res.status(409).json({ message: 'Email should be unique'});
            return
        }

        const newUser = new User({name, email, password})
        await newUser.save() 
        const token = generateToken(newUser._id)
        const plainObject = newUser.toJSON()
        delete plainObject.password
        res.status(201).json({ message: `${name} registered successfully`, details: plainObject , token: token})


    }catch(err){
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
}

const login = async (req, res) => {
    try{
        const {email , password} = req.body;
        const user = await User.findOne({email}).select('+password')
        if(!user || !(await user.comparePasswords(password))){
            res.status(401).json({message: 'Invalid email or password. Please try again'})
            return
        }
        const token = generateToken(user._id)
        const plainObject = user.toJSON()
        delete plainObject.password
        res.status(200).json({ message: `welcome Back! ${user.name}`, details: plainObject , token: token})

    }catch(err){
        res.status(500).json({ message: 'Something went wrong!', error: err.message });

    }
}

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId)

    if(user === null){
        res.status(404).json({message: 'Unable to find'})
        return
    }
    res.status(200).json({details: user})
  } catch(err) {
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
  }
}


module.exports = { signup, login, getMe};