require('dotenv').config();
var jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({
            EC: -1,
            EM: 'Authorization token not found'
        });
    }

    const token = authHeader.split(' ')[1]; // tách chuỗi token từ header

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_LOGIN);
        req.user = decodedToken.userId;
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
