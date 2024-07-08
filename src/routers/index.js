const express = require('express');
const userRouter = require('./user/user.router');
const friendRequestRouter = require('./friendRequest/friendRequest.router');
const routers = express.Router();

routers.use('/user', userRouter);
routers.use('/friend-request', friendRequestRouter);

module.exports = routers;
