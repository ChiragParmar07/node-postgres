const userService = require('../../services/user/user.service');
const {
	signupUserValidation,
	createSignupUserPayload,
	signinUserValidation,
} = require('../../models/user/user.model');

const signupUser = async (req, res) => {
	try {
		// Create a new user payload from the request body
		const payload = createSignupUserPayload(req.body);

		// Check given payload is valid or not
		const isDataValid = signupUserValidation(payload);
		if (isDataValid) {
			return res.status(400).json({
				status: 'fail',
				message: isDataValid,
			});
		}

		// Check user is already exists with the provided email or not
		const existingUser = await userService.findUserFromEmail(payload.email);
		if (existingUser) {
			return res.status(400).json({
				status: 'fail',
				message: 'Email already exists',
			});
		}

		// Insert new user in DB
		const response = await userService.signupUser(payload);

		return res.json({
			status: 'success',
			message: 'User signup successfully',
			data: response,
		});
	} catch (error) {
		console.log('Error while signup user: ', error);
		return res.json({
			status: 'fail',
			message: error?.message || 'Error while signup user',
		});
	}
};

const signinUser = async (req, res) => {
	try {
		const isDataValid = signinUserValidation(req.body);
		if (isDataValid) {
			return res.status(400).json({
				status: 'fail',
				message: isDataValid,
			});
		}

		const response = await userService.signinUser(req.body);

		return res.json({
			status: 'success',
			message: 'User signin successfully',
			data: response,
		});
	} catch (error) {
		console.log('Error while signin user: ', error);

		return res.json({
			status: 'fail',
			message: error?.message || 'Error while signin user',
		});
	}
};

module.exports = {
	signupUser,
	signinUser,
};
