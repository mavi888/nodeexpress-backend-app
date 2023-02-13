const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocument } = require('@aws-sdk/lib-dynamodb');

let client = null;

const getClient = () => {
	if (client) return client;

	const dbClient = new DynamoDBClient({});
	client = DynamoDBDocument.from(dbClient);

	return client;
};

module.exports = { getClient };
