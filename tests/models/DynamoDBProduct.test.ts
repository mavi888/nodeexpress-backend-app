import {
	Product,
	createProduct,
	deleteProduct,
	getAllProducts,
	filterProductByPrice,
	findProductsByCategory,
	getProduct,
	findProductByTitle,
} from '../../server/models/DynamoDBProduct';

test('ProductsModel: CRUD operations on a product', async () => {
	//1. Create the product
	const product = new Product(
		'productId',
		'email@gmail.com',
		'productName',
		123,
		'productDescription',
		['productImage'],
		1
	);
	await createProduct(product);

	//2. Get the product
	const productReturned = await getProduct('productId');

	expect(productReturned.productId).toBe('productId');

	//3.Delete the product
	await deleteProduct('productId');

	try {
		await getProduct('productId');
	} catch (error) {
		expect(error).toBeInstanceOf(Error);
		expect(error).toHaveProperty('message', 'No item');
	}
});

test('ProductsModel: get all products', async () => {
	//1. Create a couple of products
	const product1 = new Product(
		'productId1',
		'email@gmail.com',
		'productName',
		123,
		'productDescription',
		['productImage'],
		1
	);
	await createProduct(product1);

	const product2 = new Product(
		'productId2',
		'email@gmail.com',
		'productName',
		123,
		'productDescription',
		['productImage'],
		1
	);
	await createProduct(product2);

	//2. Test get all products

	const products = await getAllProducts();

	expect(products.length).toBe(2);
	expect(products[1].productId).toBe('productId1');
	expect(products[0].productId).toBe('productId2');

	//3. Delete products
	await deleteProduct('productId1');
	await deleteProduct('productId2');
});

test('ProductsModel: filter by price ranges 0,10', async () => {
	//1. Create a couple of products
	const product1 = new Product(
		'productId1',
		'email@gmail.com',
		'productName',
		1,
		'productDescription',
		['productImage'],
		1
	);
	await createProduct(product1);

	const product2 = new Product(
		'productId2',
		'email@gmail.com',
		'productName',
		100,
		'productDescription',
		['productImage'],
		1
	);
	await createProduct(product2);

	//2. Test the filtering

	const products = await filterProductByPrice(0, 10);
	expect(products.length).toBe(1);
	expect(products[0].productId).toBe('productId1');

	//3. Delete products
	await deleteProduct('productId1');
	await deleteProduct('productId2');
});

test('ProductsModel: filter by price ranges 100, 1000', async () => {
	//1. Create a couple of products
	const product1 = new Product(
		'productId1',
		'email@gmail.com',
		'productName',
		1,
		'productDescription',
		['productImage'],
		1
	);
	await createProduct(product1);

	const product2 = new Product(
		'productId2',
		'email@gmail.com',
		'productName',
		100,
		'productDescription',
		['productImage'],
		1
	);
	await createProduct(product2);

	//2. Test the filtering

	const products = await filterProductByPrice(100, 1000);
	expect(products.length).toBe(1);
	expect(products[0].productId).toBe('productId2');

	//3. Delete products
	await deleteProduct('productId1');
	await deleteProduct('productId2');
});

test('ProductsModel: filter by price ranges 2, 99', async () => {
	//1. Create a couple of products
	const product1 = new Product(
		'productId1',
		'email@gmail.com',
		'productName',
		1,
		'productDescription',
		['productImage'],
		1
	);
	await createProduct(product1);

	const product2 = new Product(
		'productId2',
		'email@gmail.com',
		'productName',
		100,
		'productDescription',
		['productImage'],
		1
	);
	await createProduct(product2);

	//2. Test the filtering
	const products = await filterProductByPrice(2, 99);
	expect(products.length).toBe(0);

	//3. Delete products
	await deleteProduct('productId1');
	await deleteProduct('productId2');
});

test('ProductsModel: filter by category', async () => {
	//1. Create a couple of products
	const product1 = new Product(
		'productId1',
		'email@gmail.com',
		'productName',
		1,
		'productDescription',
		['productImage'],
		1
	);
	await createProduct(product1);

	const product2 = new Product(
		'productId2',
		'email@gmail.com',
		'productName',
		100,
		'productDescription',
		['productImage'],
		2
	);
	await createProduct(product2);

	//2. Test the filtering
	const products = await findProductsByCategory(1);
	expect(products.length).toBe(1);

	//3. Delete products
	await deleteProduct('productId1');
	await deleteProduct('productId2');
});

test('ProductsModel: find product by title with cases', async () => {
	//1. Create a couple of products
	const product1 = new Product(
		'productId1',
		'email@gmail.com',
		'sticker of aws',
		1,
		'productDescription',
		['productImage'],
		1
	);
	await createProduct(product1);

	const product2 = new Product(
		'productId2',
		'email@gmail.com',
		'Sticker of aws',
		100,
		'productDescription',
		['productImage'],
		2
	);
	await createProduct(product2);

	//2. Test the filtering
	const products = await findProductByTitle('sticker');
	expect(products.length).toBe(2);

	//3. Delete products
	await deleteProduct('productId1');
	await deleteProduct('productId2');
});

test('ProductsModel: find product by title with spaces', async () => {
	//1. Create a couple of products
	const product1 = new Product(
		'productId1',
		'email@gmail.com',
		'stickerofaws',
		1,
		'productDescription',
		['productImage'],
		1
	);
	await createProduct(product1);

	const product2 = new Product(
		'productId2',
		'email@gmail.com',
		'Sticker of aws',
		100,
		'productDescription',
		['productImage'],
		2
	);
	await createProduct(product2);

	//2. Test the filtering
	const products = await findProductByTitle('sticker ');
	expect(products.length).toBe(1);

	//3. Delete products
	await deleteProduct('productId1');
	await deleteProduct('productId2');
});

test('ProductsModel: find product by title no match', async () => {
	//1. Create a couple of products
	const product1 = new Product(
		'productId1',
		'email@gmail.com',
		'stickerofaws',
		1,
		'productDescription',
		['productImage'],
		1
	);
	await createProduct(product1);

	const product2 = new Product(
		'productId2',
		'email@gmail.com',
		'Sticker of aws',
		100,
		'productDescription',
		['productImage'],
		2
	);
	await createProduct(product2);

	//2. Test the filtering
	const products = await findProductByTitle('aws');
	expect(products.length).toBe(0);

	//3. Delete products
	await deleteProduct('productId1');
	await deleteProduct('productId2');
});
