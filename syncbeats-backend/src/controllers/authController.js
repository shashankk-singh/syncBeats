const User = require('../models/user.js')
const generateToken = require('../utils/generateToken.js')
const generateRefreshToken = require('../utils/generateRefreshToken.js')
const jwt = require('jsonwebtoken')

const signup = async (req, res) => {
    try {
        const isProd = process.env.NODE_ENV === 'production'
        const {name, email, password} = req.body

        if(await User.findOne({email})){ // check for existingUser
            res.status(409).json({ message: 'Email should be unique'});
            return
        }

        const newUser = new User({name, email, password})
        await newUser.save() 
        
        const accessToken = generateToken(newUser._id)
        const refreshToken = generateRefreshToken(newUser._id)

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'None' : 'Lax',
            maxAge: 15 * 60 * 1000
        })

        res.cookie('refreshToken', refreshToken, {
            path: '/api/auth/refresh',
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'None' : 'Lax',
            maxAge: 30 * 24 * 60 * 60 * 1000
        })
        
        const plainObject = newUser.toJSON()
        delete plainObject.password
        res.status(201).json({ message: `${name} registered successfully`, details: plainObject})


    }catch(err){
        res.status(500).json({ message: 'Error registering user', error: err.message });
    }
}

const login = async (req, res) => {
    try{
        const isProd = process.env.NODE_ENV === 'production'
        const {email , password} = req.body;
        const user = await User.findOne({email}).select('+password')
        if(!user || !(await user.comparePasswords(password))){
            res.status(401).json({message: 'Invalid email or password. Please try again'})
            return
        }
        const accessToken = generateToken(user._id)
        const refreshToken = generateRefreshToken(user._id)

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'None' : 'Lax',
            maxAge: 15 * 60 * 1000
        })

        res.cookie('refreshToken', refreshToken, {
            path: '/api/auth/refresh',
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'None' : 'Lax',
            maxAge: 30 * 24 * 60 * 60 * 1000
        })

        const plainObject = user.toJSON()
        delete plainObject.password
        res.status(200).json({ message: `welcome Back! ${user.name}`, details: plainObject})

    }catch(err){
        res.status(500).json({ message: 'Something went wrong!', error: err.message });
        

    }
}

const logout = (req, res) => {
    try {
        const isProd = process.env.NODE_ENV === 'production'

        res.clearCookie('accessToken', {
            path: '/',
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'None' : 'Lax'
        })

        res.clearCookie('refreshToken', {
            path: '/api/auth/refresh',
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'None' : 'Lax'
        })

        res.status(200).json({ message: 'Log Out Successfully' })
    } catch (err) {
        res.status(500).json({ message: 'Something went wrong!', error: err.message })
    }
}

const refresh = (req, res) => {
    try{
       const refreshToken = req.cookies.refreshToken
       if(!refreshToken){ 
          return res.status(401).json({message: 'No refresh token, please login again'})
      }
      const decoded = jwt.verify(refreshToken , process.env.JWT_SECRET)

      if(!decoded){ 
        return res.status(401).json({message: 'No refresh token, please login again'})
         
      }
      if(decoded.type !== 'refresh'){
        return res.status(401).json({message: 'Not a refreshToken'})
      }
      const accessToken = generateToken(decoded.userId)
      res.cookies('accessToken', accessToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'None' : 'Lax',
            maxAge: 15 * 60 * 1000
        })
      res.status(200).json({ message: `welcome Back!`})


    }catch(err){
        if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid or expired refresh token, please login again' })
     }
      res.status(500).json({ message: 'Something went wrong!', error: err.message })
    }
}


const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password')

    if(user === null){
        res.status(404).json({message: 'Unable to find'})
        return
    }
    res.status(200).json({details: user})
  } catch(err) {
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
  }
}


module.exports = { signup, login, getMe, refresh, logout};