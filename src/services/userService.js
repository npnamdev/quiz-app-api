const User = require("../models/userModel");
const { uploadSingleFileImage } = require('../helpers/uploadFile');
const { createAccessToken, createRefreshToken, verifyRefreshToken } = require('../middlewares/JwtToken');
require('dotenv').config();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

module.exports = {
    //Create A User
    createUserService: async (req, res) => {
        const { username, email, password, phone, address, role } = req.body;
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
        const { page, limit } = req.query;
        const skip = (page - 1) * limit;
        let totalUsers = await User.countDocuments();

        try {
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
        const { username, password, role } = req.body;
        try {
            const user = await User.findById(req.params.id);
            console.log(user);
            let imageURL = user.image;

            if (req.files && req.files.avatar) {
                imageURL = await uploadSingleFileImage(req.files.avatar);
                imageURL = `http://${process.env.HOST_NAME}:${process.env.PORT}/images/${imageURL.path}`;
            }

            let result = await User.findOneAndUpdate(
                { _id: req.params.id },
                {
                    username, password, role,
                    avatar: imageURL === user.image ? user.image : imageURL
                },
                { new: true }
            );

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


    //Filter User
    filterUserService: async (req, res) => {
        const { page, limit, keyword } = req.query;
        const skip = (page - 1) * limit;

        try {
            if (keyword == "") {
                let totalUsers = await User.find({}).countDocuments();
                let result = await User.find({})
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
            } else {
                let totalUsers = await User.find({ role: keyword }).countDocuments();
                let result = await User.find({ role: keyword })
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
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                EC: -1,
                EM: "Error Server!"
            });
        }
    },


    //Search User
    searchUserService: async (req, res) => {
        const { page, limit, keyword } = req.query;
        const skip = (page - 1) * limit;

        try {
            if (keyword) {
                let totalUsers = await User.find({ email: new RegExp(`^${keyword}`) }).countDocuments();
                let result = await User.find({ email: new RegExp(`^${keyword}`) })
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
            } else {
                let totalUsers = await User.find({}).countDocuments();
                let result = await User.find({})
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
            }
        } catch (error) {
            return res.status(500).json({
                EC: -1,
                EM: "Error Server!"
            });
        }
    },



    registerService: async (req, res) => {
        const { username, email, password } = req.body;

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
                username, email, password,
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