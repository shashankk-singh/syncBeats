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
        res.status(201).json({ message: `User ${name} registered successfully`, details: plainObject , token: token});


    }catch(err){
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
}

module.exports = { signup };