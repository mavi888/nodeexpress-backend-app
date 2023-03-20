import {
	Order,
	createOrder,
	getOrder,
	deleteOrder,
	getUserHistory,
	getUserCurrentCart,
	purchaseOrder,
} from '../../server/models/DynamoDBOrder';

import { ulid } from 'ulid';

test('OrderModel: CRUD operations on a order', async () => {
	//1. Create the order
	const orderId = ulid();
	const order = new Order(orderId, 'email@email.com', 'date', 'COMPLETED');

	await createOrder(order);

	//2. Get the order
	const orderReturned = await getOrder('email@email.com', orderId);
	expect(orderReturned.orderId).toEqual(order.orderId);

	//3.Delete the orders
	await deleteOrder('email@email.com', orderId);

	try {
		await getOrder('email@email.com', orderId);
	} catch (error) {
		expect(error).toBeInstanceOf(Error);
		expect(error).toHaveProperty('message', 'No item');
	}
});

test('OrderModel: Get user order history', async () => {
	const orderId1 = ulid();
	const orderId2 = ulid();
	const orderId3 = ulid();

	//1. Create some orders
	const order1 = new Order(
		orderId1,
		'email@email.com',
		'1676313091',
		'COMPLETED'
	);

	await createOrder(order1);

	const order2 = new Order(
		orderId2,
		'email2@email.com',
		'1676313150',
		'COMPLETED'
	);

	await createOrder(order2);

	const order3 = new Order(
		orderId3,
		'email@email.com',
		'1676313150',
		'COMPLETED'
	);

	await createOrder(order3);

	//2. Get the user history
	const userHistoryUser1 = await getUserHistory('email@email.com');
	expect(userHistoryUser1.length).toEqual(2);

	const userHistoryUser2 = await getUserHistory('email2@email.com');
	expect(userHistoryUser2.length).toEqual(1);

	//3.Delete the orders
	await deleteOrder('email@email.com', orderId1);
	await deleteOrder('email2@email.com', orderId2);
	await deleteOrder('email@email.com', orderId3);
});

test('OrderModel: Get user current order', async () => {
	//1. Create some orders
	const orderId1 = ulid();

	const order1 = new Order(
		orderId1,
		'email@email.com',
		'1676313091',
		'COMPLETED'
	);

	await createOrder(order1);
	const orderId2 = ulid();
	const order2 = new Order(orderId2, 'email@email.com');

	await createOrder(order2);

	const orderId3 = ulid();
	const order3 = new Order(
		orderId3,
		'email@email.com',
		'1676313150',
		'COMPLETED'
	);
	await createOrder(order3);

	//2. Get the user current order
	const userCurrentCart = await getUserCurrentCart('email@email.com');
	expect(userCurrentCart.length).toEqual(1);
	expect(userCurrentCart[0].orderId).toEqual(orderId2);

	//3.Delete the orders
	await deleteOrder('email@email.com', orderId1);
	await deleteOrder('email@email.com', orderId2);
	await deleteOrder('email@email.com', orderId3);
});

test('OrderModel: Get user history without current order', async () => {
	//1. Create some orders
	const orderId1 = ulid();
	const order1 = new Order(
		orderId1,
		'email@email.com',
		'1676313091',
		'COMPLETED'
	);
	await createOrder(order1);

	const orderId2 = ulid();
	const order2 = new Order(orderId2, 'email@email.com');
	await createOrder(order2);

	const orderId3 = ulid();
	const order3 = new Order(
		orderId3,
		'email@email.com',
		'1676313150',
		'COMPLETED'
	);
	await createOrder(order3);

	//2. Get the user history
	const userHistoryUser1 = await getUserHistory('email@email.com');
	expect(userHistoryUser1.length).toEqual(2);

	//3.Delete the orders
	await deleteOrder('email@email.com', orderId1);
	await deleteOrder('email@email.com', orderId2);
	await deleteOrder('email@email.com', orderId3);
});

test('OrderModel: Mark order as completed', async () => {
	//1. Create a orders
	const orderId1 = ulid();
	const order1 = new Order(orderId1, 'email@email.com');
	await createOrder(order1);

	//2. Mark order as completed
	await purchaseOrder('email@email.com', orderId1, '1676317222', 1, 10);

	const order = await getOrder('email@email.com', orderId1);
	expect(order.orderId).toEqual(orderId1);
	expect(order.status).toEqual('COMPLETED');
	expect(order.date).toEqual('1676317222');

	//3.Delete the orders
	await deleteOrder('email@email.com', orderId1);
});
