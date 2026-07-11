const jwt = require('jsonwebtoken')


const protect = (req, res, next) => {
  
  const accessToken = req.cookies.accessToken
  if (!accessToken) {
     return res.status(401).json({ message: 'No access token, please login again' })
   }
    try{
    const decoded = jwt.verify(accessToken , process.env.JWT_SECRET)
    if (decoded.type !== 'access') {
     return res.status(401).json({ message: 'Invalid token type' })
   }
    req.userId = decoded.userId
    next()
    }catch(err){
        if (err.name === 'TokenExpiredError' || err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid or expired refresh token, please login again' })
     }
      res.status(500).json({ message: 'Something went wrong!', error: err.message })
    }

}


module.exports = protect; 