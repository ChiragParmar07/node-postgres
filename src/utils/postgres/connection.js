const { Pool } = require('pg');

// Create a pool of connections
const pool = new Pool({
	user: 'postgres',
	host: 'localhost', // Replace with your database host
	database: 'testDB',
	password: 'Test@1234',
	port: 5432, // Default PostgreSQL port
	max: 20, // Maximum number of connections in the pool
	idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
	connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection could not be established
});

const executeQuery = async (query, args) => {
	const result = await pool.query(query, args);

	return result.rows[0];
};

module.exports = executeQuery;
