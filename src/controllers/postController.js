const {
    createPostService,
    getAllPostService,
    getAPostService,
    updatePostService,
    deletePostService
} = require("../services/postService");

module.exports = {
    //Lấy Tất cả Posts
    getAllPostController: async (req, res) => {
        const data = await getAllPostService(req, res);
        return data;
    },



    //Lấy Chi tiết 1 Posts
    getAPostController: async (req, res) => {
        const data = await getAPostService(req, res);
        return data;
    },





    //Tạo mới Posts
    createPostController: async (req, res) => {
        const data = await createPostService(req, res);
        return data;
    },



    //Sửa Posts
    updatePostController: async (req, res) => {
        const data = await updatePostService(req, res);
        return data;
    },



    //Xóa Posts
    deletePostController: async (req, res) => {
        const data = await deletePostService(req, res);
        return data;
    },
}