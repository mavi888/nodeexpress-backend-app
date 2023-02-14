import { getClient } from './client';

export abstract class Item {
	abstract get pk(): string;
	abstract get sk(): string;

	public keys(): Key {
		return {
			PK: this.pk,
			SK: this.sk,
		};
	}

	abstract toItem(): Record<any, unknown>;
}

type Key = {
	PK: string;
	SK: string;
};

// ------ CRUD OPERATIONS -------
export const createItem = async (item: Item) => {
	console.log('create item base');
	const client = getClient();

	const params = {
		TableName: process.env.TABLE_NAME,
		Item: item.toItem(),
		ConditionExpression:
			'attribute_not_exists(PK) and attribute_not_exists(SK)',
	};

	console.log(params);

	try {
		await client.put(params);
		return item;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const getItem = async (item: Item) => {
	const client = getClient();

	const params = {
		TableName: process.env.TABLE_NAME,
		Key: item.keys(),
	};

	try {
		const response = await client.get(params);
		return response;
	} catch (error) {
		throw error;
	}
};

export const deleteItem = async (item: Item) => {
	const client = getClient();

	const params = {
		TableName: process.env.TABLE_NAME,
		Key: item.keys(),
	};

	try {
		const response = await client.delete(params);
		return response;
	} catch (error) {
		throw error;
	}
};
