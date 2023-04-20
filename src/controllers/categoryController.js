const {
    createCategoryService,
    getAllCategorysService,
    getACategorysService,
    updateCategoryService,
    deleteCategoryService
} = require("../services/categoryService");

module.exports = {
    //Create Category
    createCategoryController: async (req, res) => {
        let data = await createCategoryService(req, res);
        return data;
    },


    //Get Category
    getAllCategoryController: async (req, res) => {
        let data = await getAllCategorysService(req, res);
        return data;
    },

    getACategoryController: async (req, res) => {
        let data = await getACategorysService(req, res);
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
