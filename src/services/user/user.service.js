const bcryptjs = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const executeQuery = require('../../utils/postgres/connection');

// Find user using email
const findUserFromEmail = async (email) => {
	try {
		const selectQuery = `
      SELECT *
      FROM users
      WHERE email = $1;
    `;
		const user = await executeQuery(selectQuery, [email]);

		return user;
	} catch (error) {
		throw error;
	}
};

// Compare password
const comparePassword = async (plainTextPassword, hashedPassword) => {
	return await bcryptjs.compare(plainTextPassword, hashedPassword);
};

// Generate token
const tokenGenerate = async (payload) => {
	if (!payload) {
		throw new Error('Payload is required');
	}

	const token = jsonwebtoken.sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

	return token;
};

// Signup new user
const signupUser = async (payload) => {
	try {
		let { name, email, gender, mobile, password } = payload;
		// Encrypt password before insert a new user in DB
		password = await bcryptjs.hash(
			password,
			+process.env.PASSWORD_ENCRYPT_LEVEL
		);

		// Create a query for insert user in DB
		const insertQuery = `
    INSERT INTO users (name, email, gender, mobile, password)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

		// Execute a query
		const user = await executeQuery(insertQuery, [
			name,
			email,
			gender,
			mobile,
			password,
		]);
		delete user.password;

		// Generate JWT token for authenticated user
		const token = await tokenGenerate({ id: user.id });

		return { user, token };
	} catch (error) {
		throw error;
	}
};

// Signin a user
const signinUser = async (payload) => {
	try {
		let { email, password } = payload;

		// Find user if exists or not
		let user = await findUserFromEmail(email);
		if (!user) {
			throw new Error('Invalid email or password');
		}

		// Compare user's DB password and given password are match or not
		const isMatch = await comparePassword(password, user.password);
		if (!isMatch) {
			throw new Error('Invalid email or password');
		}

		// Generate JWT token for authenticated user
		const token = await tokenGenerate({ id: user.id });

		const updateQuery = `
    UPDATE users
    SET login_count = $2,
    updatedAt = $3
    WHERE id = $1;
    `;
		await executeQuery(updateQuery, [
			user.id,
			user.login_count + 1,
			new Date(),
		]);

		user = await findUserFromEmail(email);
		delete user?.password; // Delete password from user object before returning it to client.

		return { user, token };
	} catch (error) {
		throw error;
	}
};

module.exports = {
	signupUser,
	signinUser,
	findUserFromEmail,
};
