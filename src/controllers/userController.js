const {
    createUserService,
    getAllUserService,
    getAUserService,
    updateUserService,
    deleteUserService,
    registerService,
    loginService,
    logoutService
} = require("../services/userService");



module.exports = {
    //Tạo mới 1 User
    createUserController: async (req, res) => {
        let data = await createUserService(req, res);
        return data;
    },


    //Lấy Tất cả User
    getAllUserController: async (req, res) => {
        let data = await getAllUserService(req, res);
        return data;
    },


    //Lấy Chi tiết 1 User
    getAUserController: async (req, res) => {
        const data = await getAUserService(req, res);
        return data;
    },


    //Sửa 1 User
    updateUserController: async (req, res) => {
        let data = await updateUserService(req, res);
        return data;
    },


    //Xóa 1 User
    deleteUserController: async (req, res) => {
        let data = await deleteUserService(req, res);
        return data;
    },


    registerController: async (req, res) => {
        let data = await registerService(req, res);
        return data;
    },


    loginController: async (req, res) => {
        let data = await loginService(req, res);
        return data;
    },


    logoutController: async (req, res) => {
        let data = await logoutService(req, res);
        return data;
    },

}