import { Item, createItem, getItem, deleteItem } from './base';
import { getClient } from './client';

export class Product extends Item {
	productId: string;
	writerEmail: string;
	title: string;
	description: string;
	price: number;
	images: string[];
	category: number;
	sold: number;

	constructor(
		productId: string,
		writerEmail: string,
		title: string,
		price: number,
		description?: string,
		images?: string[],
		category?: number,
		sold?: number
	) {
		super();
		this.productId = productId;
		this.writerEmail = writerEmail;
		this.title = title;
		this.description = description || '';
		this.price = price;
		this.images = images || [];
		this.category = category || 0;
		this.sold = sold || 0;
	}

	get pk(): string {
		return `PRODUCT#${this.productId}`;
	}

	get sk(): string {
		return `PRODUCT#${this.productId}`;
	}

	get gsi1pk(): string {
		return `PRODUCT#${this.category}`;
	}

	get gsi1sk(): string {
		return `PRODUCT#${this.productId}`;
	}

	get gsi2pk(): string {
		return `PRODUCT#`;
	}

	get gsi2sk(): number {
		return this.price;
	}

	get gsi3pk(): string {
		return `PRODUCT#`;
	}

	get gsi3sk(): string {
		return `PRODUCT#${this.title.toLowerCase()}`;
	}

	toItem(): Record<any, unknown> {
		return {
			...this.keys(),
			GSI1PK: this.gsi1pk,
			GSI1SK: this.gsi1sk,
			GSI2PK: this.gsi2pk,
			GSI2SK: this.gsi2sk,
			GSI3PK: this.gsi3pk,
			GSI3SK: this.gsi3sk,
			productId: this.productId,
			writerEmail: this.writerEmail,
			title: this.title,
			description: this.description,
			price: this.price,
			images: this.images,
			category: this.category,
			sold: this.sold,
		};
	}

	static fromItem(item?: any): Product {
		if (!item) throw new Error('No item');
		return new Product(
			item.productId,
			item.writerEmail,
			item.title,
			parseInt(item.price),
			item.description,
			item.images,
			parseInt(item.category),
			parseInt(item.sold)
		);
	}
}

export const createProduct = async (product: Product) => {
	return createItem(product);
};

export const getProduct = async (productId: string) => {
	const product = new Product(productId, '', '', 0, '', [], 0, 0);

	try {
		const response = await getItem(product);
		return Product.fromItem(response.Item);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const deleteProduct = async (productId: string) => {
	const product = new Product(productId, '', '', 0, '', [], 0, 0);

	try {
		const response = await deleteItem(product);
		return response;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const getAllProducts = async () => {
	const client = getClient();

	const params = {
		TableName: process.env.TABLE_NAME,
		IndexName: 'GSI2',
		KeyConditionExpression: 'GSI2PK = :gsi2pk',
		ExpressionAttributeValues: {
			':gsi2pk': 'PRODUCT#',
		},
	};

	try {
		const response = await client.query(params);
		return response.Items.map(Product.fromItem);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const filterProductByPrice = async (iPrice: number, fPrice: number) => {
	const client = getClient();

	const params = {
		TableName: process.env.TABLE_NAME,
		IndexName: 'GSI2',
		KeyConditionExpression:
			'GSI2PK = :gsi2pk AND GSI2SK BETWEEN :iPrice and :fPrice',
		ExpressionAttributeValues: {
			':gsi2pk': 'PRODUCT#',
			':iPrice': iPrice,
			':fPrice': fPrice,
		},
	};

	try {
		const response = await client.query(params);
		return response.Items.map(Product.fromItem);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const findProductsByCategory = async (category: number) => {
	const client = getClient();

	const params = {
		TableName: process.env.TABLE_NAME,
		IndexName: 'GSI1',
		KeyConditionExpression: 'GSI1PK = :gsi1pk',
		ExpressionAttributeValues: {
			':gsi1pk': `PRODUCT#${category.toString()}`,
		},
	};

	try {
		const response = await client.query(params);
		return response.Items.map(Product.fromItem);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const findProductByTitle = async (title: string) => {
	const text = title.toLocaleLowerCase();

	const client = getClient();

	const params = {
		TableName: process.env.TABLE_NAME,
		IndexName: 'GSI3',
		KeyConditionExpression: 'GSI3PK = :gsi3pk AND begins_with(GSI3SK, :gsi3sk)',
		ExpressionAttributeValues: {
			':gsi3pk': 'PRODUCT#',
			':gsi3sk': `PRODUCT#${text}`,
		},
	};

	try {
		const response = await client.query(params);
		return response.Items.map(Product.fromItem);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const updateProductSoldQuantity = async (
	productId: string,
	quantitySold: number
) => {
	const product = new Product(productId, '', '', 0, '', [], 0, 0);

	const client = getClient();

	const params = {
		TableName: process.env.TABLE_NAME,
		Key: product.keys(),
		UpdateExpression: 'SET #sold = #sold + :quantitySold',
		ExpressionAttributeNames: {
			'#sold': 'sold',
		},
		ExpressionAttributeValues: {
			':quantitySold': quantitySold,
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
