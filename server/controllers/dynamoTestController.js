const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocument } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocument.from(client);

testConnection = async () => {
	console.log('test connection');

	const tableName = process.env.TABLE_NAME;
	console.log(tableName);

	const params = {
		Key: {
			PK: 'item1',
			SK: 'test2',
		},
		TableName: process.env.TABLE_NAME,
	};

	console.log(params);

	try {
		const response = await ddbDocClient.get(params);
		console.log('Success :', response.Item);
	} catch (err) {
		console.log('Error', err);
	}

	return;
};

module.exports = {
	testConnection,
};
