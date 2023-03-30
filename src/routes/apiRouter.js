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
    registerController,
    loginController,
    logoutController
} = require('../controllers/userController');



router.post('/users', createUserController);

router.get('/users', getAllUserController);

router.get('/users/:id', getAUserController);

router.put('/users/:id', updateUserController);

router.delete('/users/:id', deleteUserController);

router.post('/users/filter', filterUserController);

router.post('/users/search', searchUserController);

router.post('/register', registerController);

router.post('/login', loginController);

router.post('/logout', logoutController);


module.exports = router;