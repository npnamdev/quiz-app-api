const express = require('express');
const router = express.Router();
const { createUserValidation, updateUserValidation, validateUser } = require('../middlewares/validateUser')
const authenticateUser = require('../middlewares/authenticateUser');

const {
    createUserController,
    getAllUserController,
    getAUserController,
    updateUserController,
    deleteUserController,
    registerController,
    loginController,
    logoutController
} = require('../controllers/userController');



router.post(
    '/users',
    authenticateUser,
    createUserValidation,
    validateUser,
    createUserController
);

router.get('/users', getAllUserController);

router.get('/users/:id', getAUserController);

router.put(
    '/users/:id',
    authenticateUser,
    updateUserValidation,
    validateUser,
    updateUserController
);

router.delete('/users/:id', authenticateUser, deleteUserController);

router.post('/register', registerController);

router.post('/login', loginController);

router.post('/logout', logoutController);


// ====================================================


const {
    createCategoryController,
    getAllCategoryController,
    getACategoryController,
    updateCategoryController,
    deleteCategoryController
} = require('../controllers/categoryController');



//Router Category Controller
router.post('/categorys', authenticateUser, createCategoryController);

router.get('/categorys', getAllCategoryController);

router.get('/categorys/:id', getACategoryController);

router.put('/categorys/:id', authenticateUser, updateCategoryController);

router.delete('/categorys/:id', authenticateUser, deleteCategoryController);



// =========================================

const {
    createPostController,
    getAllPostController,
    getAPostController,
    updatePostController,
    deletePostController
} = require('../controllers/postController');



//Router Post Controller

router.post('/posts', authenticateUser, createPostController);

router.get('/posts', getAllPostController);

router.get('/posts/:id', getAPostController);

router.put('/posts/:id', authenticateUser, updatePostController);

router.delete('/posts/:id', authenticateUser, deletePostController);


module.exports = router;