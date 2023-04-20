const User = require("../models/userModel");
require('dotenv').config();
const { uploadSingleFileImage, deleteImage } = require('../helpers/uploadFile');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');


module.exports = {
    createUserService: async (req, res) => {
        const { username, email, password, phone, address, role } = req.body;
        try {
            const imageURL = req.files?.avatar
                ? `http://${process.env.HOST_NAME}:${process.env.PORT}/images/${(await uploadSingleFileImage(req.files.avatar)).path}`
                : '';
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await User.create({ username, email, password: hashedPassword, phone, address, role, avatar: imageURL });

            return res.status(200).json({
                EC: 0,
                EM: "Create User Success",
                DT: result
            });
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
            const filterQuery = filter ? { role: filter } : {};
            const searchQuery = search ? { $or: [{ email: new RegExp(`^${search}`) }, { username: new RegExp(`^${search}`) }] } : {};

            const query = {
                ...filterQuery,
                ...searchQuery
            };

            const totalFilteredUsers = await User.countDocuments(query);
            const result = await User.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
            return res.status(200).json({
                EC: 0,
                EM: "Get All User Success",
                totalUsers,
                totalFilteredUsers,
                totalPages: Math.ceil(totalFilteredUsers / limit),
                DT: result
            });
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


    //Update A Users
    updateUserService: async (req, res) => {
        const { username, password, hashedPassword, phone, address, role } = req.body;
        try {
            const user = await User.findById(req.params.id);
            let imageURL = user.image;
            if (req.files?.avatar) {
                imageURL = `http://${process.env.HOST_NAME}:${process.env.PORT}/images/${(await uploadSingleFileImage(req.files.avatar)).path}`;
            } else {
                imageURL = null;
            }
            const result = await User.findByIdAndUpdate(req.params.id, {
                username,
                password: hashedPassword,
                role,
                phone,
                address,
                avatar: user.image ? user.image : imageURL
            }, { new: true });

            if (imageURL === null) {
                await deleteImage(user.image);
            }
            return res.status(200).json({
                EC: 0,
                EM: "Update User Success",
                DT: result,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                EC: -1,
                EM: "Error Server!",
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


    //API Register
    registerService: async (req, res) => {
        const { username, email, password, phone, address } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const imageURL = req.files?.avatar
                ? `http://${process.env.HOST_NAME}:${process.env.PORT}/images/${(await uploadSingleFileImage(req.files.avatar)).path}`
                : '';
            const result = await User.create({
                username,
                email,
                password: hashedPassword,
                phone,
                address,
                avatar: imageURL
            });
            return res.status(200).json({
                EC: 0,
                EM: "Register Success",
                DT: result
            });
        } catch (error) {
            return res.status(500).json({
                EC: -1,
                EM: "Error Server!"
            });
        }
    },


    //API Login
    loginService: async (req, res) => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(500).json({
                    EC: -1,
                    EM: 'Email does not exist!'
                });
            }
            const checkPass = await bcrypt.compare(password, user.password);
            if (!checkPass) {
                return res.status(500).json({
                    EC: -1,
                    EM: 'Incorrect password!'
                });
            }

            // Create AccessToken
            const accessToken = jwt.sign(
                { userId: user._id },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '1h' }
            );


            // Save accessToken to user's token array in the database
            user.tokens.push({ token: accessToken });
            await user.save();

            return res.status(200).json({
                EC: 0,
                EM: 'Login Success',
                DT: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    avatar: user.avatar,
                    role: user.role,
                    accessToken,
                }
            });
        } catch (error) {
            return res.status(500).json({
                EC: -1,
                EM: 'Error Server!'
            });
        }
    },


    //API logout
    logoutService: async (req, res) => {
        try {
            // Get the current user's accessToken
            const user = req.user;
            const accessToken = user.tokens[user.tokens.length - 1].token;

            // Revoke the current accessToken
            await User.updateOne({ _id: user._id, 'tokens.token': accessToken }, { $set: { 'tokens.$.isRevoked': true } });

            // Remove the current accessToken from the user object
            user.tokens = user.tokens.filter(token => token.token !== req.token);
            await user.save();

            return res.status(200).json({
                EC: 0,
                EM: 'Logged out successfully'
            });
        } catch (error) {
            return res.status(500).json({
                EC: -1,
                EM: 'Error Server!'
            });
        }
    },

}