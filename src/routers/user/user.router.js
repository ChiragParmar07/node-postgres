const express = require('express');
const {
	signupUser,
	signinUser,
} = require('../../controllers/user/user.controller');

const userRouter = express.Router();

userRouter.route('/signup').post(signupUser);
userRouter.route('/signin').post(signinUser);

module.exports = userRouter;
