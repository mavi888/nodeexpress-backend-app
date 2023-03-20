import { Item, createItem, getItem, deleteItem } from './base';
import { getClient } from './client';

export class OrderItem extends Item {
	orderId: string;
	productId: string;
	userId: string;
	quantity: number;
	productImage: string;
	productTitle: string;
	totalPrice: number;

	constructor(
		orderId: string,
		productId: string,
		userId: string,
		quantity: number,
		productImage: string,
		productTitle: string,
		totalPrice: number
	) {
		super();
		this.orderId = orderId;
		this.productId = productId;
		this.userId = userId;
		this.quantity = quantity;
		this.productImage = productImage;
		this.productTitle = productTitle;
		this.totalPrice = totalPrice;
	}

	get pk(): string {
		return `ORDERITEMS#${this.orderId}`;
	}
	get sk(): string {
		return `ORDERITEMS#${this.productId}`;
	}

	toItem(): Record<any, unknown> {
		return {
			...this.keys(),
			orderId: this.orderId,
			productId: this.productId,
			userId: this.userId,
			quantity: this.quantity,
			productImage: this.productImage,
			productTitle: this.productTitle,
			totalPrice: this.totalPrice,
		};
	}

	static fromItem(item?: any): OrderItem {
		if (!item) throw new Error('No item');
		return new OrderItem(
			item.orderId,
			item.productId,
			item.userId,
			item.quantity,
			item.productImage,
			item.productTitle,
			item.totalPrice
		);
	}
}

export const createOrderItem = async (orderItem: OrderItem) => {
	return await createItem(orderItem);
};

export const getOrderItems = async (orderId: string, productId: string) => {
	const orderItem = new OrderItem(orderId, productId, '', 0, '', '', 0);

	try {
		const response = await getItem(orderItem);
		return OrderItem.fromItem(response.Item);
	} catch (err) {
		console.log(err);
		throw err;
	}
};

export const deleteOrderItem = async (orderId: string, productId: string) => {
	const orderItem = new OrderItem(orderId, productId, '', 0, '', '', 0);

	try {
		await deleteItem(orderItem);
	} catch (err) {
		console.log(err);
		throw err;
	}
};

export const getOrderItemsByOrderId = async (orderId: string) => {
	const client = getClient();

	const params = {
		TableName: process.env.TABLE_NAME,
		KeyConditionExpression: 'PK = :pk',
		ExpressionAttributeValues: {
			':pk': `ORDERITEMS#${orderId}`,
		},
	};

	try {
		const response = await client.query(params);
		return response.Items.map(OrderItem.fromItem);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const addItemToOrder = async (
	orderId: string,
	productId: string,
	quantity: number,
	totalPrice: number
) => {
	const orderItem = new OrderItem(orderId, productId, '', 0, '', '', 0);

	const client = getClient();

	const params = {
		TableName: process.env.TABLE_NAME,
		Key: orderItem.keys(),
		UpdateExpression:
			'SET #quantity = #quantity + :q, #totalPrice = #totalPrice + :tp',
		ExpressionAttributeNames: {
			'#quantity': 'quantity',
			'#totalPrice': 'totalPrice',
		},
		ExpressionAttributeValues: {
			':q': quantity,
			':tp': totalPrice,
		},
	};

	console.log(params);

	try {
		const response = await client.update(params);
		return response;
	} catch (err) {
		console.log(err);
		throw err;
	}
};

export const removeItemToOrder = async (
	orderId: string,
	productId: string,
	quantity: number,
	totalPrice: number
) => {
	const orderItem = new OrderItem(
		orderId,
		productId,
		'',
		quantity,
		'',
		'',
		totalPrice
	);

	const client = getClient();

	const params = {
		TableName: process.env.TABLE_NAME,
		Key: orderItem.keys(),
		UpdateExpression:
			'SET #quantity = #quantity - :q, #totalPrice = #totalPrice - :tp',
		ExpressionAttributeNames: {
			'#quantity': 'quantity',
			'#totalPrice': 'totalPrice',
		},
		ExpressionAttributeValues: {
			':q': quantity,
			':tp': totalPrice,
		},
	};

	try {
		const response = await client.update(params);
		return response;
	} catch (err) {
		console.log(err);
		throw err;
	}
};
