import { Product, createProduct } from '../../server/models/DynamoDBProduct';
import { User, registerUser } from '../../server/models/DynamoDBUser';

import { ulid } from 'ulid';

const userId = '<email>';

test('ProductsMigration: Create new user', async () => {
	const user = new User(userId, 'Test', 'FooBar');
	await registerUser(user);
});

test('ProductsMigration: Add half of the existing products to DynamoDB', async () => {
	const product1 = new Product(
		ulid(),
		userId,
		'Lambda hoodie',
		50,
		'Black Lambda Hoodie',
		['uploads/1653052809657_hoodie-lambda.webp'],
		1
	);
	await createProduct(product1);

	const product2 = new Product(
		ulid(),
		userId,
		'Cloud Nerd Hoodie',
		60,
		'Blue Cloud Nerd Hoodie',
		['uploads/1653052843415_hoodie-cloud-nerd.webp'],
		1
	);
	await createProduct(product2);

	const product3 = new Product(
		ulid(),
		userId,
		'AWS Hoodie',
		55,
		'Black AWS Hoodie',
		['uploads/1653052862752_hoodie-aws-black.webp'],
		1
	);
	await createProduct(product3);

	const product4 = new Product(
		ulid(),
		userId,
		'AWS Hoodie',
		55,
		'Grey AWS Hoodie',
		['uploads/1653052879339_hoodie-aws.webp'],
		1
	);
	await createProduct(product4);

	const product5 = new Product(
		ulid(),
		userId,
		'Lambda Hat',
		15,
		'White Lambda Hat',
		['uploads/1653052894265_hat-aws-lambda.webp'],
		4
	);
	await createProduct(product5);

	const product6 = new Product(
		ulid(),
		userId,
		'AWS Hat',
		16,
		'Black AWS Hat',
		['uploads/1653052922581_hat-aws-black.webp'],
		4
	);
	await createProduct(product6);

	const product7 = new Product(
		ulid(),
		userId,
		'AWS Hat',
		13,
		'White AWS Hat',
		['uploads/1653052943600_hat-aws.webp'],
		4
	);
	await createProduct(product7);

	const product8 = new Product(
		ulid(),
		userId,
		'AWS Notebook',
		10,
		'White cloud AWS Notebook',
		['uploads/1653052962173_book-aws.webp'],
		2
	);
	await createProduct(product8);

	const product9 = new Product(
		ulid(),
		userId,
		'Bucket Notebook',
		10,
		'S3 Bucket Blue Notebook',
		['uploads/1653052982434_book-s3.webp'],
		2
	);
	await createProduct(product9);

	const product10 = new Product(
		ulid(),
		userId,
		'Lamb Tshirt',
		20,
		'Lambda TShirt White',
		['uploads/1653053006523_tshirt-lambda.webp'],
		0
	);
	await createProduct(product10);
});

test('ProductsMigration: Add other half of the existing products to DynamoDB', async () => {
	const product11 = new Product(
		ulid(),
		userId,
		'Stackoverflow T-shirt',
		30,
		'Black Stackoverflow T-shirt',
		['uploads/1653053068706_tshirt-stackoverflow.webp'],
		0
	);
	await createProduct(product11);

	const product12 = new Product(
		ulid(),
		userId,
		'Devops Mug',
		20,
		'White devops mug',
		['uploads/1653053114624_mug-devops.webp'],
		6
	);
	await createProduct(product12);

	const product13 = new Product(
		ulid(),
		userId,
		'Say cloud again sticker',
		5,
		'Say cloud again sticker',
		['uploads/1653053157179_sticker-cloud-again.webp'],
		5
	);
	await createProduct(product13);

	const product14 = new Product(
		ulid(),
		userId,
		'Lambda sticker',
		5,
		'Lambda sticker',
		['uploads/1653053602509_sticker-SA.webp'],
		5
	);
	await createProduct(product14);

	const product15 = new Product(
		ulid(),
		userId,
		'AWS Sticker',
		5,
		'AWS Sticker',
		['uploads/1653053620789_sticker-aws.webp'],
		5
	);
	await createProduct(product15);

	const product16 = new Product(
		ulid(),
		userId,
		'Black AWS Tshirt',
		23,
		'Black AWS Tshirt',
		['uploads/1653053026267_tshirt-aws.webp'],
		0
	);
	await createProduct(product16);

	const product17 = new Product(
		ulid(),
		userId,
		'S3 T-Shirt',
		45,
		'White AWS S3 T-Shirt',
		['uploads/1653052943600_hat-aws.webp'],
		0
	);
	await createProduct(product17);

	const product18 = new Product(
		ulid(),
		userId,
		'Serverless mug',
		15,
		'All Serverless Services mug',
		['uploads/1653053136738_mug-serverless.webp'],
		6
	);
	await createProduct(product18);

	const product19 = new Product(
		ulid(),
		userId,
		'There is no cloud sticker',
		10,
		'There is no cloud sticker',
		['uploads/1653053179857_sticker-cloud.webp'],
		5
	);
	await createProduct(product19);

	const product20 = new Product(
		ulid(),
		userId,
		'Captcha Tshirt',
		24,
		'Grey captcha Tshirt',
		['uploads/1653053043104_tshirt-captcha.webp'],
		0
	);
	await createProduct(product20);
});
