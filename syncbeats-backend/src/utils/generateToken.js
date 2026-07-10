const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    return jwt.sign({ userId, type: 'access'} , process.env.JWT_SECRET, { expiresIn: '15m' }) // {userId: userId } , shorthand { userId }
}

module.exports = generateToken;