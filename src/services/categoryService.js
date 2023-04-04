const Category = require("../models/categoryModel");
require('dotenv').config();

module.exports = {
    //Get Category
    getAllCategorysService: async (req, res) => {
        try {
            let result = await Category.find({}).sort({ createdAt: -1 })

            return res.status(200).json({
                EC: 0,
                EM: "Get All Category Success",
                DT: result
            })
        } catch (error) {
            return res.status(500).json({
                EC: -1,
                EM: "Error Server!"
            });
        }
    },



    //Create Category
    createCategoryService: async (req, res) => {
        const { name } = req.body;
        try {
            let result = await Category.create({ name });

            return res.status(200).json({
                EC: 0,
                EM: "Create Category Success",
                DT: result
            })
        } catch (error) {
            return res.status(500).json({
                EC: -1,
                EM: "Error Server!"
            });
        }

    },



    //Update Category
    updateCategoryService: async (req, res) => {
        const { id } = req.params;
        const { name } = req.body;
        try {
            let result = await Category.findOneAndUpdate(
                { _id: id },
                { name },
                { new: true }
            );

            return res.status(200).json({
                EC: 0,
                EM: "Update Category Success",
                DT: result
            })
        } catch (error) {
            return res.status(500).json({
                EC: -1,
                EM: "Error Server!"
            });
        }
    },


    //Delete Category
    deleteCategoryService: async (req, res) => {
        const { id } = req.params;
        try {
            let result = await Category.findByIdAndDelete({ _id: id });

            return res.status(200).json({
                EC: 0,
                EM: "Delete Category Success",
                DT: result
            })
        } catch (error) {
            return res.status(500).json({
                EC: -1,
                EM: "Error Server!"
            });
        }
    },
}