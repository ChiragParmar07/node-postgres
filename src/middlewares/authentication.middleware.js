const jwt = require('jsonwebtoken');
const userService = require('../services/user/user.service');

const authentication = async (req, res, next) => {
	try {
		let token;

		// Extract the JWT token from the request headers
		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith('Bearer')
		) {
			token = req.headers.authorization.split(' ')[1];
		}

		// If no token is provided, return an unauthorized response
		if (!token) {
			return res.status(401).json({
				message: 'You are not logged in! Login to get access.',
			});
		}

		// Verify the JWT token and extract user data
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		const email = decodedToken['email'];

		// Fetch the current user from the database
		const currentUser = await userService.getUserFromEmail(email);

		// If the user does not exist, return an unauthorized response
		if (!currentUser) {
			return res.status(401).json({
				message: 'The user belonging to this token does no longer exist.',
			});
		}

		// If the user is deleted, return an unauthorized response
		if (currentUser.deleted) {
			return res.status(401).json({
				message: 'The user belonging to this token has been deleted.',
			});
		}

		// Attach the current user to the request object
		req['currentUser'] = currentUser;

		// Call the next middleware function
		next();
	} catch (error) {
		// Handle JWT expiration error
		if (error.message === 'jwt expired') {
			return res
				.status(401)
				.json({ message: 'Token Expired! Login again to get access.' });
		}

		// Handle other authentication errors
		return res.status(401).json({ message: 'You are not authenticated!' });
	}
};

module.exports = { authentication };
