import {
	addProduct,
	findProductById,
	findProductWithQuery,
} from '../../server/controllers/productController';

import * as product from '../../server/models/DynamoDBProduct';

test('ProductController: add a new product', async () => {
	jest.clearAllMocks();

	const input = {
		category: 5,
		description: 'test description',
		images: ['uploads/image (6).png'],
		price: 122,
		title: 'test title',
		writer: '63d8274d37c7f13e069618a2',
	};

	const mocked = jest.spyOn(product, 'createProduct');

	mocked.mockImplementation();

	const productSaved = await addProduct(input);

	const inputProduct = {
		category: 5,
		description: 'test description',
		images: ['uploads/image (6).png'],
		price: 122,
		sold: 0,
		productId: productSaved.productId,
		title: 'test title',
		writerEmail: '63d8274d37c7f13e069618a2',
	};

	expect(mocked).toHaveBeenCalled();
	expect(mocked).toHaveBeenCalledWith(inputProduct);
});

test('ProductController: Find a product by id', async () => {
	jest.clearAllMocks();

	const input = ['productId1'];

	const mocked = jest.spyOn(product, 'getProduct');
	mocked.mockImplementation((productId): any => {
		return {
			productId,
			category: '5',
			description: 'test description',
			images: ['uploads/image (6).png'],
			price: '122',
			sold: 0,
			title: 'test title',
			writerEmail: '63d8274d37c7f13e069618a2',
		};
	});

	const productReturned = await findProductById(input);

	expect(mocked).toHaveBeenCalledTimes(1);
	expect(mocked).toHaveBeenCalledWith(input[0]);

	expect(productReturned[0].productId).toBe(input[0]);
});

test('ProductController: Find multiple products by id', async () => {
	jest.clearAllMocks();

	const input = ['productId1', 'productId2', 'productId3'];

	const mocked = jest.spyOn(product, 'getProduct');
	mocked.mockImplementation((productId): any => {
		return {
			productId,
			category: '5',
			description: 'test description',
			images: ['uploads/image (6).png'],
			price: '122',
			sold: 0,
			title: 'test title',
			writerEmail: '63d8274d37c7f13e069618a2',
		};
	});

	const productReturned = await findProductById(input);

	expect(mocked).toHaveBeenCalledTimes(3);

	expect(productReturned[0].productId).toBe(input[0]);
	expect(productReturned[1].productId).toBe(input[1]);
	expect(productReturned[2].productId).toBe(input[2]);
});

test('ProductController: Find all products', async () => {
	jest.clearAllMocks();

	const mocked = jest.spyOn(product, 'getAllProducts');

	const productsReturned = await findProductWithQuery();

	expect(mocked).toHaveBeenCalledTimes(1);
});

test('ProductController: Find all in category', async () => {
	jest.clearAllMocks();

	const mocked = jest.spyOn(product, 'findProductsByCategory');

	await findProductWithQuery([1]);

	expect(mocked).toHaveBeenCalledTimes(1);
	expect(mocked).toHaveBeenCalledWith(1);
});

test('ProductController: Find all in 2 categories', async () => {
	jest.clearAllMocks();

	const mocked = jest.spyOn(product, 'findProductsByCategory');

	const inputCategory = [1, 2];
	await findProductWithQuery(inputCategory);

	expect(mocked).toHaveBeenCalledTimes(2);
});

test('ProductController: Find all with prices', async () => {
	jest.clearAllMocks();

	const mocked = jest.spyOn(product, 'filterProductByPrice');

	const inputCategory = [];

	await findProductWithQuery(inputCategory, '', 0, 100);

	expect(mocked).toHaveBeenCalledTimes(1);
	expect(mocked).toHaveBeenCalledWith(0, 100);
});

test('ProductController: Find all with term', async () => {
	jest.clearAllMocks();

	const mocked = jest.spyOn(product, 'findProductByTitle');

	const inputCategory = [];

	await findProductWithQuery(inputCategory, 'term');

	expect(mocked).toHaveBeenCalledTimes(1);
	expect(mocked).toHaveBeenCalledWith('term');
});
