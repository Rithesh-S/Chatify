const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY

const verifyJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.sendStatus(401);
    }
  
    jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = decoded;
      next();
    });
  }

  

  module.exports = {
        verifyJWT
  }