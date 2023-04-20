require('dotenv').config();
const User = require('../models/userModel');
var jwt = require('jsonwebtoken');

const authenticateUser = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({
                EC: -1,
                EM: 'Authorization token not found'
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findOne({ _id: decoded.userId, 'tokens.token': token });

        if (user.tokens.isRevoked) {
            return res.status(401).json({
                EC: -1,
                EM: 'Authorization token not found'
            });
        }

        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        console.log(err)
        return res.status(401).json({
            EC: -1,
            EM: 'Invalid authorization token'
        });
    }
}


module.exports = authenticateUser;
