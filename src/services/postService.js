const User = require("../models/userModel");
const Category = require("../models/categoryModel");
const Post = require("../models/postModel");
const { uploadSingleFileImage } = require('../helpers/uploadFile');


module.exports = {
    //Create Post
    createPostService: async (req, res) => {
        const { title, description, content, categoryId } = req.body;
        try {
            let imageURL = '';
            if (req.files && req.files.image) {
                imageURL = await uploadSingleFileImage(req.files.image);
                imageURL = `http://${process.env.HOST_NAME}:${process.env.PORT}/images/${imageURL.path}`;
            }

            const category = await Category.findById({ _id: categoryId });
            if (!category) {
                return res.status(500).json({
                    EC: -1,
                    EM: "directory does not exist!"
                });
            }

            let result = await Post.create({
                title,
                description,
                content,
                author: req.user._id,
                category: categoryId,
                image: imageURL
            });

            await User.findByIdAndUpdate(req.user, { $push: { posts: result._id } });

            await Category.findByIdAndUpdate(categoryId, { $push: { posts: result._id } });

            return res.status(200).json({
                EC: 0,
                EM: "Create A Post Success",
                DT: result
            })
        } catch (error) {
            return res.status(500).json({
                EC: -1,
                EM: "Error Server!"
            });
        }
    },



    //Get All Post
    getAllPostService: async (req, res) => {
        const { page, limit, search, filter } = req.query;
        const skip = (page - 1) * limit;
        try {
            const category = await Category.findOne({ name: filter });
            const filterQuery = filter ? { category: category._id } : {};
            const searchQuery = search ? { $or: [{ title: new RegExp(`^${search}`) }, { description: new RegExp(`^${search}`) }] } : {};

            const query = {
                ...filterQuery,
                ...searchQuery
            };

            const totalPost = await Post.countDocuments(query);

            const result = await Post.find(query)
                .populate("author", "username")
                .populate("category", "name")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            return res.status(200).json({
                EC: 0,
                EM: "Get All Post Success",
                totalPost,
                totalPage: Math.ceil(totalPost / limit),
                DT: result,
            });
        } catch (error) {
            return res.status(500).json({
                EC: -1,
                EM: "Error Server!",
            });
        }
    },




    //Get A Post
    getAPostService: async (req, res) => {
        try {
            let result = await Post.find({ _id: req.params.id })
                .populate("author", ["username", "avatar"])
                .populate("category", "name")
                ;

            return res.status(200).json({
                EC: 0,
                EM: "Get A Post Success",
                DT: result
            })
        } catch (error) {
            return res.status(500).json({
                EC: -1,
                EM: "Error Server!"
            });
        }
    },




    //Update User
    updatePostService: async (req, res) => {
        const { id } = req.params;
        const { title, description, content, categoryId } = req.body;

        try {
            const post = await Post.findById(id);
            let imageURL = post.image;
            if (req.files && req.files.image) {
                const newImageURL = await uploadSingleFileImage(req.files.image);
                imageURL = `http://${process.env.HOST_NAME}:${process.env.PORT}/images/${newImageURL.path}`;
            }

            const oldCategory = post.category;

            // Xóa bài post cũ trong danh mục
            await Category.findByIdAndUpdate(
                oldCategory,
                { $pull: { posts: post._id } },
                { new: true }
            );

            let result = await Post.findByIdAndUpdate(
                id,
                {
                    title,
                    description,
                    content,
                    category: categoryId,
                    image: imageURL === post.image ? post.image : imageURL,
                }, { new: true }
            );

            // Cập nhật danh sách post trong CategorySchema
            await Category.findByIdAndUpdate(
                categoryId,
                { $addToSet: { posts: result._id } },
                { new: true }
            );

            return res.status(200).json({
                EC: 0,
                EM: "Update A Post Success",
                DT: result
            })
        } catch (error) {
            return res.status(500).json({
                EC: -1,
                EM: "Error Server!"
            });
        }
    },


    //Delete User
    deletePostService: async (req, res) => {
        try {
            const post = await Post.findById(req.params.id);

            // Xóa bài viết khỏi danh mục
            await Category.findByIdAndUpdate(
                post.category,
                { $pull: { posts: post._id } },
                { new: true }
            );

            // Xóa bài viết khỏi danh sách post của tác giả
            await User.findByIdAndUpdate(
                post.author,
                { $pull: { posts: post._id } },
                { new: true }
            );

            let result = await Post.findByIdAndDelete({ _id: req.params.id });

            return res.status(200).json({
                EC: 0,
                EM: "delete A Post Success",
                DT: result
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                EC: -1,
                EM: "Error Server!"
            });
        }
    },
}