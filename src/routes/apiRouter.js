const express = require('express');
const router = express.Router();
const { createUserValidation, updateUserValidation, validateUser } = require('../middlewares/validateUser')

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



router.post('/users', createUserValidation, validateUser, createUserController);

router.get('/users', getAllUserController);

router.get('/users/:id', getAUserController);

router.put('/users/:id', updateUserValidation, validateUser, updateUserController);

router.delete('/users/:id', deleteUserController);

router.post('/register', registerController);

router.post('/login', loginController);

router.post('/logout', logoutController);


// ====================================================


const {
    createCategoryController,
    getAllCategoryController,
    updateCategoryController,
    deleteCategoryController
} = require('../controllers/categoryController');



//Router User Controller

router.post('/categorys', createCategoryController);

router.get('/categorys', getAllCategoryController);

router.put('/categorys/:id', updateCategoryController);

router.delete('/categorys/:id', deleteCategoryController);



// =========================================

const {
    createPostController,
    getAllPostController,
    getAPostController,
    updatePostController,
    deletePostController
} = require('../controllers/postController');



//Router Post Controller

router.post('/posts', createPostController);

router.get('/posts', getAllPostController);

router.get('/posts/:id', getAPostController);

router.put('/posts/:id', updatePostController);

router.delete('/posts/:id', deletePostController);


module.exports = router;