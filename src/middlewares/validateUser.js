const { body, validationResult } = require('express-validator');
const User = require("../models/userModel");

// Hàm validate createUser
const createUserValidation = [
    body('username')
        .isLength({ max: 15 })
        .withMessage('Username <= 15 characters!'),
    body('email')
        .isEmail()
        .withMessage('Email Invalidate!')
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) {
                return Promise.reject('Email already exists');
            }
        }),
    body('password')
        .isLength({ min: 6, max: 12 })
        .withMessage('Password 6 and 12 characters'),
];



// Hàm validate updateUser
const updateUserValidation = [
    body('username')
        .isLength({ max: 15 })
        .withMessage('Username <= 15 characters!'),
    body('email')
        .optional()
        .isEmail()
        .withMessage('Email Invalidate!')
        .custom(async (value, { req }) => {
            const user = await User.findOne({ email: value });
            if (user && user.email !== req.user.email) {
                return Promise.reject('Email already exists');
            }
        }),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password 6 '),
];


// Middleware để nhả lỗi validate
const validateUser = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(401).json({
            EC: -1,
            EM: errors.array()[0].msg,
        });
    }
    next();
};

module.exports = { createUserValidation, updateUserValidation, validateUser }