const {
    createCategoryService,
    getAllCategorysService,
    updateCategoryService,
    deleteCategoryService
} = require("../services/categoryService");

module.exports = {
    //Get Category
    getAllCategoryController: async (req, res) => {
        let data = await getAllCategorysService(req, res);
        return data;
    },


    //Create Category
    createCategoryController: async (req, res) => {
        let data = await createCategoryService(req, res);
        return data;
    },


    //Update Category
    updateCategoryController: async (req, res) => {
        let data = await updateCategoryService(req, res);
        return data;
    },


    //Delete Category
    deleteCategoryController: async (req, res) => {
        let data = await deleteCategoryService(req, res);
        return data;
    },
}
