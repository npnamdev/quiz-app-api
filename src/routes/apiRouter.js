const express = require('express');
const router = express.Router();


const {
    createUserController,
    getAllUserController,
    getAUserController,
    updateUserController,
    deleteUserController,
    filterUserController,
    searchUserController,
    // loginController,
    // logoutController
} = require('../controllers/userController');



//Tạo Mới 1 User
router.post('/users', createUserController);

//Lấy Tất Cả User
router.get('/users', getAllUserController);

//Lấy Chi Tiết 1 User
router.get('/users/:id', getAUserController);

//Chỉnh Sửa 1 User
router.put('/users/:id', updateUserController);

//Xóa 1 User
router.delete('/users/:id', deleteUserController);

//Lọc User Theo Role
router.post('/users/filter', filterUserController);

//Tìm Kiếm User Theo Email
router.post('/users/search', searchUserController);

//Đăng Nhập 
// router.post('/login', loginController);

//Đăng Xuất
// router.post('/logout', logoutController);


module.exports = router;