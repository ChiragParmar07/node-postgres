const express = require('express');
const {
	sendFriendRequest,
	getFriendRequests,
	getFriends,
	acknowledgeFriendRequest,
} = require('../../controllers/friendRequest/friendRequest.controller');
const {
	authentication,
} = require('../../middlewares/authentication.middleware');

const friendRequestRouter = express.Router();

friendRequestRouter.use(authentication);

friendRequestRouter.route('/send-request').post(sendFriendRequest);
friendRequestRouter.route('/acknowledge').post(acknowledgeFriendRequest);
friendRequestRouter.route('/requests').get(getFriendRequests);
friendRequestRouter.route('/friends').get(getFriends);

module.exports = friendRequestRouter;
