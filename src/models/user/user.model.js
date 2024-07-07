const { GENDER } = require('../../constants/key.constants');

const createSignupUserPayload = (body) => {
	const payload = {
		name: body?.name.trim() || '',
		email: body?.email.toLowerCase().trim() || '',
		gender: body?.gender.toLowerCase().trim() || '',
		mobile: body?.mobile,
		password: body?.password.trim() || '',
	};

	return payload;
};

const signupUserValidation = (payload) => {
	if (!payload.name) {
		return 'Please provide valid name';
	}

	if (!payload.email) {
		return 'Please provide valid email';
	}

	if (!payload.gender || !GENDER.includes(payload.gender)) {
		return 'Please provide valid gender. Insert male and female as a gender';
	}

	if (!payload.mobile || payload.mobile.toString().length !== 10) {
		return 'Please provide valid mobile number. Ex. Mobile number length is exactly 10 digit';
	}

	if (
		!payload.password ||
		payload.password.length < 8 ||
		payload.password.length > 12
	) {
		return 'Please provide valid password. Password length should be between 8 to 12 characters';
	}

	return '';
};

const signinUserValidation = (body) => {
	if (!body.email) {
		return 'Please provide valid email';
	}

	if (!body.password || body.password.length < 8 || body.password.length > 12) {
		return 'Please provide valid password. Password length should be between 8 to 12 characters';
	}

	return '';
};

module.exports = {
	createSignupUserPayload,
	signupUserValidation,
	signinUserValidation,
};
