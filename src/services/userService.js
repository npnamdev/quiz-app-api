const User = require("../models/userModel");
const { uploadSingleFileImage, deleteImage } = require('../helpers/uploadFile');
const { createAccessToken, createRefreshToken } = require('../middlewares/JwtToken');
require('dotenv').config();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const Joi = require('joi');

module.exports = {
    //Create A User
    createUserService: async (req, res) => {
        const { username, email, password, phone, address, role } = req.body;
        const checkEmail = Joi.string().email({ minDomainSegments: 2 }).required();
        const checkPassword = Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'));


        try {
            const validateEmail = checkEmail.validate(email);
            const validatePassword = checkPassword.validate(password);
            if (validateEmail.error) {
                return res.status(401).json({
                    EC: -1,
                    EM: validateEmail.error.details[0].message
                })
            }

            if (validatePassword.error) {
                return res.status(401).json({
                    EC: -1,
                    EM: validatePassword.error.details[0].message
                })
            }

            let imageURL = '';
            if (req.files && req.files.avatar) {
                imageURL = await uploadSingleFileImage(req.files.avatar);
                imageURL = `http://${process.env.HOST_NAME}:${process.env.PORT}/images/${imageURL.path}`;
            }

            let result = await User.create({
                username, email, password, phone, address, role,
                avatar: imageURL
            });
            return res.status(200).json({
                EC: 0,
                EM: "Create User Success",
                DT: result
            })
        } catch (error) {
            return res.status(500).json({
                EC: -1,
                EM: "Error Server!"
            });
        }
    },



    //Get All User
    getAllUserService: async (req, res) => {
        const { page, limit, search, filter } = req.query;
        const skip = (page - 1) * limit;
        let totalUsers = await User.countDocuments();

        try {
            if (search && !filter) {
                let totalUsers = await User.find({ email: new RegExp(`^${search}`) }).countDocuments();
                let result = await User.find({ email: new RegExp(`^${search}`) })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit);

                return res.status(200).json({
                    EC: 0,
                    EM: "Search User Success",
                    totalUsers,
                    totalPages: Math.ceil(totalUsers / limit),
                    DT: result
                })
            } else if (filter && !search) {
                let totalUsers = await User.find({ role: filter }).countDocuments();
                let result = await User.find({ role: filter })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit);

                return res.status(200).json({
                    EC: 0,
                    EM: "Filter User Success",
                    totalUsers,
                    totalPages: Math.ceil(totalUsers / limit),
                    DT: result
                })
            } else if (search && filter) {
                let totalUsers = await User.find({
                    $and: [
                        { email: new RegExp(`^${search}`) },
                        { role: filter }
                    ]
                }).countDocuments();

                let result = await User.find({
                    $and: [
                        { email: new RegExp(`^${search}`) },
                        { role: filter }
                    ]
                })
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit);

                return res.status(200).json({
                    EC: 0,
                    EM: "Filter & Search User Success",
                    totalUsers,
                    totalPages: Math.ceil(totalUsers / limit),
                    DT: result
                })
            } else {
                let result = await User.find({})
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit);

                return res.status(200).json({
                    EC: 0,
                    EM: "Get All User Success",
                    totalUsers,
                    totalPages: Math.ceil(totalUsers / limit),
                    DT: result
                })
            }
        } catch (error) {
            return res.status(500).json({
                EC: -1,
                EM: "Error Server!"
            });
        }
    },


    //Get A User
    getAUserService: async (req, res) => {
        try {
            let result = await User.find({ _id: req.params.id });
            return res.status(200).json({
                EC: 0,
                EM: "Get A User Success",
                DT: result
            })
        } catch (error) {
            return res.status(500).json({
                EC: -1,
                EM: "Error Server!"
            });
        }
    },



    //Update A User
    updateUserService: async (req, res) => {
        const { username, password, phone, address, role } = req.body;
        try {
            const user = await User.findById(req.params.id);
            console.log(user);
            let imageURL = user.image;

            if (req.files && req.files.avatar) {
                imageURL = await uploadSingleFileImage(req.files.avatar);
                imageURL = `http://${process.env.HOST_NAME}:${process.env.PORT}/images/${imageURL.path}`;
            } else {
                imageURL = null;
            }

            let result = await User.findOneAndUpdate(
                { _id: req.params.id },
                {
                    username, password, role, phone, address,
                    avatar: imageURL === user.image ? user.image : imageURL
                },
                { new: true }
            );

            if (imageURL === null) {
                await deleteImage(user.image);
            }


            return res.status(200).json({
                EC: 0,
                EM: "Update User Success",
                DT: result
            })
        } catch (error) {
            return res.status(500).json({
                EC: -1,
                EM: "Error Server!"
            });
        }
    },


    //Delete A User
    deleteUserService: async (req, res) => {
        try {
            let result = await User.findByIdAndDelete({ _id: req.params.id });

            return res.status(200).json({
                EC: 0,
                EM: "Delete User Success",
                DT: result
            })
        } catch (error) {
            return res.status(500).json({
                EC: -1,
                EM: "Error Server!"
            });
        }
    },



    registerService: async (req, res) => {
        const { username, email, password, phone, address } = req.body;

        try {
            const checkEmail = await User.findOne({ email });

            if (checkEmail) {
                return res.status(500).json({
                    EC: -1,
                    EM: "Email Already Exists!"
                })
            }

            let imageURL = '';
            if (req.files && req.files.avatar) {
                imageURL = await uploadSingleFileImage(req.files.avatar);
                imageURL = `http://${process.env.HOST_NAME}:${process.env.PORT}/images/${imageURL.path}`;
            }

            let result = await User.create({
                username, email, password, phone, address,
                avatar: imageURL
            });


            return res.status(200).json({
                EC: 0,
                EM: "Register Success",
                DT: result
            })
        } catch (error) {
            return res.status(500).json({
                EC: -1,
                EM: "Error Server!"
            });
        }
    },



    // //Login
    loginService: async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(500).json({
                    EC: -1,
                    EM: 'Email does not exist!'
                })
            }

            const checkPass = await bcrypt.compare(password, user.password);
            if (!checkPass) {
                return res.status(500).json({
                    EC: -1,
                    EM: 'Incorrect password!'
                })
            }

            let accessToken = createAccessToken({
                userId: user._id
            });

            let refreshToken = createRefreshToken({
                userId: user._id
            });

            return res.status(200).json({
                EC: 0,
                EM: "Search User Success",
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                accessToken,
                refreshToken,
            })
        } catch (error) {
            return res.status(500).json({
                EC: -1,
                EM: "Error Server!"
            });
        }
    },





    logoutService: async (req, res) => {
        const { refreshToken } = req.body;
        try {
            jwt.verify(refreshToken, process.env.JWT_SECRET_LOGOUT)

            return res.status(200).json({
                EC: 0,
                EM: 'Logout Success'
            })
        } catch (error) {
            return res.status(500).json({
                EC: -1,
                EM: "Error Server!"
            });
        }
    },
}