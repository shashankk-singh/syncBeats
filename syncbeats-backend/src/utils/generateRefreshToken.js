const jwt = require('jsonwebtoken');

const generateRefreshToken = (userId) => {
    return jwt.sign({ userId, type: 'refresh' } , process.env.JWT_SECRET, { expiresIn: '30d' }) 
}

module.exports = generateRefreshToken;