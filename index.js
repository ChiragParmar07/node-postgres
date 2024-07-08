const { Sequelize } = require('sequelize');
const { DataTypes } = require('sequelize');

const sequelize = new Sequelize('testDB', 'postgres', 'Test@1234', {
	host: 'localhost',
	dialect: 'postgres',
});

const User = sequelize.define('users', {
	id: {
		type: DataTypes.INTEGER,
		autoIncrement: true,
		primaryKey: true,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
		unique: true,
	},
	gender: {
		type: DataTypes.ENUM('male', 'female'),
		allowNull: false,
	},
	mobile: {
		type: DataTypes.STRING,
		allowNull: false,
		validate: {
			len: [10, 10],
		},
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	status: {
		type: DataTypes.ENUM('active', 'deleted', 'deactivate'),
		defaultValue: 'active',
	},
	login_count: {
		type: DataTypes.INTEGER,
		defaultValue: 0,
	},
	createdat: {
		type: DataTypes.DATE,
		defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
	},
	updatedat: {
		type: DataTypes.DATE,
		defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
	},
});

const insertUser = async () => {
	try {
		await sequelize.sync(); // Ensure the database schema is in sync

		const newUser = await User.create({
			name: 'John Doe',
			email: 'john.doe@example.com',
			gender: 'male',
			mobile: '1234567890',
			password: 'Test@1234',
		});

		console.log('User inserted successfully:', newUser.toJSON());
	} catch (error) {
		console.error('Error inserting user:', error);
	} finally {
		await sequelize.close();
	}
};

const getUser = async () => {
	try {
		const user = await User.findByPk(1);
		console.log('User:', user.toJSON());
	} catch (error) {
		console.error('Error getting user:', error);
	} finally {
		await sequelize.close();
	}
};

insertUser();
// getUser();
