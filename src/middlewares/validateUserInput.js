const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const User = require("../models/userModel");


// Validate API CreateUser
const validateUserCreation = [
    body('username')
        .isLength({ min: 5, max: 15 })
        .withMessage('Username must be between 6 and 15 characters!'),
    body('email')
        .isEmail()
        .optional()
        .withMessage('Invalid email format!')
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) {
                throw new Error('Email already exists!');
            }
            return true;
        }),
    body('password')
        .isLength({ min: 6, max: 15 })
        .withMessage('Password must be between 6 and 15 characters!'),
    body('phone')
        .matches(/^[0-9]{10,11}$/)
        .withMessage('Invalid phone number format!'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                EC: -1,
                EM: errors.array()[0].msg
            });
        }
        next();
    }
];



// Validate API UpdateUser
const validateUserUpdate = [
    body('username')
        .isLength({ min: 5, max: 15 })
        .withMessage('Username must be between 6 and 15 characters!'),
    body('email')
        .optional()
        .custom((value, { req }) => {
            if (value !== undefined) {
                return Promise.reject('You are not allowed to change your email');
            }
            return true;
        }),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .custom(async (value, { req }) => {
            const user = await User.findOne({ _id: req.params.id });
            if (user.password == value) {
                const hashedPassword = user.password;
                req.body.hashedPassword = hashedPassword;
                return true;
            } else {
                if (value.length < 6 || value.length > 12) {
                    return Promise.reject('Password must be between 6 and 12 characters!');
                } else {
                    const hashedPassword = await bcrypt.hash(value, 10);
                    req.body.hashedPassword = hashedPassword;
                    return true;
                }
            }
        }),
    body('phone')
        .matches(/^[0-9]{10,11}$/)
        .withMessage('Invalid phone number format!'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                EC: -1,
                EM: errors.array()[0].msg
            });
        }
        next();
    }
];



// Validate API Register
const validateUserRegistration = [
    body('username')
        .isLength({ min: 5, max: 15 })
        .withMessage('Username must be between 6 and 15 characters!'),
    body('email')
        .isEmail()
        .withMessage('Invalid email format!')
        .custom(async (value) => {
            const user = await User.findOne({ email: value });
            if (user) {
                throw new Error('Email already exists!');
            }
            return true;
        }),
    body('password')
        .isLength({ min: 6, max: 15 })
        .withMessage('Password must be between 6 and 15 characters!'),
    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password and Confirm Password do not match!');
            }
            return true;
        }),
    body('phone')
        .matches(/^[0-9]{10,11}$/)
        .withMessage('Invalid phone number format!'),
    (req, res, next) => {
        if (req.body.role) {
            return res.status(400).json({
                EC: -1,
                EM: "Role field is not allowed in request body!"
            });
        }
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                EC: -1,
                EM: errors.array()[0].msg
            });
        }
        next();
    }
];

module.exports = {
    validateUserCreation,
    validateUserUpdate,
    validateUserRegistration
};
