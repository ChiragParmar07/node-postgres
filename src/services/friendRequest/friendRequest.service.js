const {
	FRIEND_REQUEST_STATUS,
	FRIEND_REQUEST_STATUS_ARRAY,
} = require('../../models/friendRequest/friendRequest.model');
const executeQuery = require('../../utils/postgres/connection');

// Find user using email
const getFriendRequest = async (requesterId, receiverId) => {
	try {
		if (!requesterId || typeof requesterId !== 'number' || requesterId < 0) {
			throw new Error('Requester ID is invalid');
		}
		if (!receiverId || typeof receiverId !== 'number' || receiverId < 0) {
			throw new Error('Receiver ID is invalid');
		}

		const selectQuery = `
        SELECT
          *
        FROM
          friend_requests
        WHERE
          requesterId = $1
          and receiverId = $2;
    `;
		const result = await executeQuery(selectQuery, [requesterId, receiverId]);
		const request = result[0];

		return request;
	} catch (error) {
		throw error;
	}
};

const sendFriendRequest = async (requesterId, receiverId) => {
	try {
		const insertQuery = `
        INSERT INTO
          friend_requests (requesterId, receiverId)
        VALUES ($1, $2)
    `;
		await executeQuery(insertQuery, [requesterId, receiverId]);

		return true;
	} catch (error) {
		throw error;
	}
};

const updateFriendRequest = async (requesterId, receiverId, status) => {
	try {
		if (!FRIEND_REQUEST_STATUS_ARRAY.includes(status)) {
			throw new Error('Invalid status');
		}

		const updateQuery = `
        UPDATE
          friend_requests
        SET
          status = $3,
          updatedAt = $4
        WHERE
          requesterId = $1
          and receiverId = $2;
    `;
		await executeQuery(updateQuery, [
			requesterId,
			receiverId,
			status,
			new Date(),
		]);

		return true;
	} catch (error) {
		throw error;
	}
};

const getFriendRequests = async (receiverId) => {
	try {
		if (!receiverId || typeof receiverId !== 'number' || receiverId < 0) {
			throw new Error('Receiver ID is invalid');
		}

		const selectQuery = `
        SELECT
          fr.id AS friend_request_id,
          fr.status,
          requester.name AS requester_name,
          requester.email AS requester_email
        FROM 
          friend_requests fr
        JOIN 
          users requester ON fr.requesterId = requester.id
        WHERE 
          fr.receiverId = $1
          and fr.status = $2;
    `;
		const requests = await executeQuery(selectQuery, [
			receiverId,
			FRIEND_REQUEST_STATUS.PENDING,
		]);

		return requests;
	} catch (error) {
		throw error;
	}
};

const getFriends = async (receiverId) => {
	try {
		if (!receiverId || typeof receiverId !== 'number' || receiverId < 0) {
			throw new Error('Requester ID is invalid');
		}

		const selectQuery = `
        SELECT
          fr.id AS friend_request_id,
          fr.status,
          requester.name AS requester_name,
          requester.email AS requester_email
        FROM 
          friend_requests fr
        JOIN 
          users requester ON fr.requesterId = requester.id
        WHERE 
          fr.receiverId = $1
          and fr.status = $2;
    `;
		const friends = await executeQuery(selectQuery, [
			receiverId,
			FRIEND_REQUEST_STATUS.ACCEPTED,
		]);

		return friends;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	getFriendRequest,
	sendFriendRequest,
	updateFriendRequest,
	getFriendRequests,
	getFriends,
};
