const {
	FRIEND_REQUEST_STATUS,
} = require('../../models/friendRequest/friendRequest.model');
const friendRequestService = require('../../services/friendRequest/friendRequest.service');

const sendFriendRequest = async (req, res) => {
	try {
		const existingRequest = await friendRequestService.getFriendRequest(
			req.currentUser.id,
			req.body.receiverId
		);

		if (existingRequest) {
			if (existingRequest.status === 'pending') {
				return res.json({
					status: 'fail',
					message: 'Friend request already sent',
				});
			} else if (existingRequest.status === 'accepted') {
				return res.json({
					status: 'fail',
					message: 'You are already friends with this user',
				});
			} else {
				await friendRequestService.updateFriendRequest(
					req.currentUser.id,
					req.body.receiverId,
					'pending'
				);

				return res.json({
					status: 'success',
					message: 'Friend request sent successfully',
				});
			}
		}

		await friendRequestService.sendFriendRequest(
			req.currentUser.id,
			req.body.receiverId
		);

		return res.json({
			status: 'success',
			message: 'Friend request sent successfully',
		});
	} catch (error) {
		console.log('Error while signup user: ', error);
		return res.json({
			status: 'fail',
			message: error?.message || 'Error while signup user',
		});
	}
};

const acknowledgeFriendRequest = async (req, res) => {
	try {
		const existingRequest = await friendRequestService.getFriendRequest(
			req.body.requesterId,
			req.currentUser.id
		);

		if (!existingRequest) {
			console.log('Request not found');
			return res.json({
				status: 'fail',
				message: 'Request not found',
			});
		}

		if (existingRequest.status === FRIEND_REQUEST_STATUS.ACCEPTED) {
			console.log('Request already accepted');
			return res.json({
				status: 'fail',
				message: 'Request already accepted',
			});
		} else if (existingRequest.status === FRIEND_REQUEST_STATUS.REJECTED) {
			console.log('Request already rejected');
			return res.json({
				status: 'fail',
				message: 'Request already rejected',
			});
		}

		await friendRequestService.updateFriendRequest(
			req.body.requesterId,
			req.currentUser.id,
			FRIEND_REQUEST_STATUS.ACCEPTED
		);

		return res.json({
			status: 'success',
			message: 'Friend request acknowledged successfully',
		});
	} catch (error) {
		console.log('Error while acknowledging friend request: ', error);
		return res.json({
			status: 'fail',
			message: error?.message || 'Error while acknowledging friend request',
		});
	}
};

const getFriendRequests = async (req, res) => {
	try {
		const requests = await friendRequestService.getFriendRequests(
			req.currentUser.id
		);

		return res.json({
			status: 'success',
			message: 'Friend requests fetched successfully',
			data: requests || [],
		});
	} catch (error) {
		console.log('Error while fetching friend requests: ', error);
		return res.json({
			status: 'fail',
			message: error?.message || 'Error while fetching friend requests',
		});
	}
};

const getFriends = async (req, res) => {
	try {
		const friends = await friendRequestService.getFriends(req.currentUser.id);

		return res.json({
			status: 'success',
			message: 'Friends fetched successfully',
			data: friends || [],
		});
	} catch (error) {
		console.log('Error while fetching friends: ', error);
		return res.json({
			status: 'fail',
			message: error?.message || 'Error while fetching friends',
		});
	}
};

module.exports = {
	sendFriendRequest,
	acknowledgeFriendRequest,
	getFriendRequests,
	getFriends,
};
