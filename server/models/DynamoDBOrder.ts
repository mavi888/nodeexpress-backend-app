import { Item, createItem, getItem, deleteItem } from './base';
import { getClient } from './client';

export class Order extends Item {
	orderId: string;
	userId: string;
	date: string;
	status: string; // CURRENT / COMPLETED
	totalPrice: number;
	totalQuantity: number;

	constructor(
		orderId: string,
		userId: string,
		date?: string,
		status?: string,
		totalPrice?: number,
		totalQuantity?: number
	) {
		super();
		this.orderId = orderId;
		this.userId = userId || '';
		this.date = date || '';
		this.status = status || 'CURRENT';
		this.totalPrice = totalPrice || 0;
		this.totalQuantity = totalQuantity || 0;
	}

	get pk(): string {
		return `USER#${this.userId}`;
	}
	get sk(): string {
		return `ORDER#${this.orderId}`;
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
			GSI3PK: this.gsi3pk,
			GSI3SK: this.gsi3sk,
			orderId: this.orderId,
			userId: this.userId,
			date: this.date,
			status: this.status,
			totalPrice: this.totalPrice,
			totalQuantity: this.totalQuantity,
		};
	}

	static fromItem(item?: any): Order {
		if (!item) throw new Error('No item');
		return new Order(
			item.orderId,
			item.userId,
			item.date,
			item.status,
			item.totalPrice,
			item.totalQuantity
		);
	}
}

export const createOrder = async (order: Order) => {
	const client = getClient();

	const params = {
		TableName: process.env.TABLE_NAME,
		Item: order.toItem(),
		ConditionExpression: 'attribute_not_exists(SK)',
	};

	try {
		await client.put(params);
		return order;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const getOrder = async (userId: string, orderId: string) => {
	const order = new Order(orderId, userId);
	try {
		const response = await getItem(order);
		return Order.fromItem(response.Item);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const deleteOrder = async (userId: string, orderId: string) => {
	const client = getClient();

	const order = new Order(orderId, userId);

	const params = {
		TableName: process.env.TABLE_NAME,
		Key: order.keys(),
	};

	try {
		const response = await client.delete(params);
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
		KeyConditionExpression: 'PK = :pk',
		FilterExpression: '#st = :status',
		ExpressionAttributeNames: {
			'#st': 'status',
		},
		ExpressionAttributeValues: {
			':pk': `USER#${userId}`,
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
		throw error;
	}
};

export const purchaseOrder = async (
	userId: string,
	orderId: string,
	date: string,
	totalPrice: number,
	totalQuantity: number
) => {
	const order = new Order(orderId, userId);

	const client = getClient();

	const params = {
		TableName: process.env.TABLE_NAME,
		Key: order.keys(),
		UpdateExpression:
			'SET #st = :status, #dt = :date, #tp = :price, #tq = :quantity, GSI3SK = :orderId',
		ExpressionAttributeNames: {
			'#st': 'status',
			'#dt': 'date',
			'#tp': 'totalPrice',
			'#tq': 'totalQuantity',
		},
		ExpressionAttributeValues: {
			':status': 'COMPLETED',
			':date': date,
			':price': totalPrice,
			':quantity': totalQuantity,
			':orderId': `ORDER#${orderId}`,
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
