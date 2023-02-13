import { Item, createItem, getItem, deleteItem } from './base';
import { getClient } from './client';

export class Order extends Item {
	orderId: string;
	userId: string;
	date: string;
	status: string; // CURRENT / COMPLETED

	constructor(
		orderId: string,
		userId?: string,
		date?: string,
		status?: string
	) {
		super();
		this.orderId = orderId;
		this.userId = userId || '';
		this.date = date || '';
		this.status = status || 'CURRENT';
	}

	get pk(): string {
		return `ORDER#${this.orderId}`;
	}
	get sk(): string {
		return `ORDER#${this.orderId}`;
	}

	get gsi1pk(): string {
		return `ORDER#${this.userId}`;
	}

	get gsi1sk(): string {
		return `ORDER#${this.date}`;
	}

	get gsi3pk(): string {
		return `ORDER#${this.userId}`;
	}

	get gsi3sk(): string {
		return `ORDER#${this.status}`;
	}

	toItem(): Record<string, unknown> {
		return {
			...this.keys(),
			GSI1PK: this.gsi1pk,
			GSI1SK: this.gsi1sk,
			GSI3PK: this.gsi3pk,
			GSI3SK: this.gsi3sk,
			orderId: this.orderId,
			userId: this.userId,
			date: this.date,
			status: this.status,
		};
	}

	static fromItem(item?: any): Order {
		if (!item) throw new Error('No item');
		return new Order(item.orderId, item.userId, item.date, item.status);
	}
}

export const createOrder = async (order: Order) => {
	return await createItem(order);
};

export const getOrder = async (orderId: string) => {
	const order = new Order(orderId);

	try {
		const response = await getItem(order);
		return Order.fromItem(response.Item);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const deleteOrder = async (orderId: string) => {
	const order = new Order(orderId);

	try {
		const response = await deleteItem(order);
		return response;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const getUserHistory = async (userId: string) => {
	const client = getClient();

	const params = {
		TableName: process.env.TABLE_NAME,
		IndexName: 'GSI1',
		KeyConditionExpression: 'GSI1PK = :pk',
		FilterExpression: '#st = :status',
		ExpressionAttributeNames: {
			'#st': 'status',
		},
		ExpressionAttributeValues: {
			':pk': `ORDER#${userId}`,
			':status': 'COMPLETED',
		},
	};

	try {
		const response = await client.query(params);
		return response.Items.map(Order.fromItem);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const getUserCurrentCart = async (userId: string) => {
	const client = getClient();

	const params = {
		TableName: process.env.TABLE_NAME,
		IndexName: 'GSI3',
		KeyConditionExpression: 'GSI3PK = :pk AND GSI3SK = :sk',
		ExpressionAttributeValues: {
			':pk': `ORDER#${userId}`,
			':sk': 'ORDER#CURRENT',
		},
	};

	try {
		const response = await client.query(params);
		return response.Items.map(Order.fromItem);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const purchaseOrder = async (orderId: string, date: string) => {
	const order = new Order(orderId);

	const client = getClient();

	const params = {
		TableName: process.env.TABLE_NAME,
		Key: order.keys(),
		UpdateExpression: 'SET #st = :status, #dt = :date',
		ExpressionAttributeNames: {
			'#st': 'status',
			'#dt': 'date',
		},
		ExpressionAttributeValues: {
			':status': 'COMPLETED',
			':date': date,
		},
	};

	try {
		const response = await client.update(params);
		return response;
	} catch (error) {
		console.log(error);
		throw error;
	}
};
