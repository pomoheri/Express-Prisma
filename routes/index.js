//import express
const express = require('express')

//init express router
const router = express.Router();

//import register controller
const registerController = require('../controllers/RegisterController');
const loginController = require('../controllers/LoginController');
const userController = require('../controllers/UserController');

//import validate register
const { validateRegister, validateLogin } = require('../utils/validators/auth');
const verifyToken = require('../middlewares/auth');
const { validateUser } = require('../utils/validators/user');

//define route for register and login
router.post('/register', validateRegister, registerController.register);
router.post('/login', validateLogin, loginController.login);

//get user
router.get('/admin/users', verifyToken, userController.findUsers);
router.post('/admin/users/add', verifyToken, validateUser, userController.createUser);
router.get('/admin/users/:id', verifyToken, userController.findUserById)
router.post('/admin/users/update/:id', verifyToken, validateUser, userController.updateUser);
router.delete('/admin/users/delete/:id', verifyToken, userController.deleteUser);

//export router
module.exports = router