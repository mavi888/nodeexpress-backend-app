import {
	OrderItem,
	createOrderItem,
	getOrderItems,
	deleteOrderItem,
	getOrderItemsByOrderId,
	addItemToOrder,
	removeItemToOrder,
} from '../../server/models/DynamoDBOrderItems';

test('OrderItemModel: CRUD operations on order item', async () => {
	//1. Create order item
	const orderItem = new OrderItem(
		'orderId1',
		'productId1',
		'userId1',
		1,
		'image',
		'productTitle',
		10
	);

	await createOrderItem(orderItem);

	//2. Get order item
	const orderItem1 = await getOrderItems('orderId1', 'productId1');

	expect(orderItem1.orderId).toEqual('orderId1');
	expect(orderItem1.productId).toEqual('productId1');
	expect(orderItem.userId).toEqual('userId1');

	//3. Delete order item
	await deleteOrderItem('orderId1', 'productId1');

	try {
		await getOrderItems('orderId1', 'productId1');
	} catch (error) {
		expect(error).toBeInstanceOf(Error);
		expect(error).toHaveProperty('message', 'No item');
	}
});

test('OrderItemModel: Add existing item to order', async () => {
	//1. Create order item
	const orderItem = new OrderItem(
		'orderId1',
		'productId1',
		'userId1',
		1,
		'image',
		'productTitle',
		10
	);

	await createOrderItem(orderItem);

	//2.Add item to order"
	await addItemToOrder('orderId1', 'productId1', 2, 20);

	const orderItem1 = await getOrderItems('orderId1', 'productId1');
	expect(orderItem1.quantity).toEqual(3);
	expect(orderItem1.totalPrice).toEqual(30);

	//3. Delete order item
	await deleteOrderItem('orderId1', 'productId1');
});

test('OrderItemModel: get order items by OrderId', async () => {
	//1. Create order items
	const orderItem1 = new OrderItem(
		'orderId1',
		'productId1',
		'userId1',
		1,
		'image',
		'productTitle',
		10
	);
	const orderItem2 = new OrderItem(
		'orderId1',
		'productId2',
		'userId1',
		2,
		'image',
		'productTitle',
		10
	);
	const orderItem3 = new OrderItem(
		'orderId1',
		'productId3',
		'userId1',
		2,
		'image',
		'productTitle',
		10
	);

	await createOrderItem(orderItem1);
	await createOrderItem(orderItem2);
	await createOrderItem(orderItem3);

	//2. Get order items by OrderId
	const orderItemsArray = await getOrderItemsByOrderId('orderId1');

	expect(orderItemsArray.length).toEqual(3);

	//3. Delete order item
	await deleteOrderItem('orderId1', 'productId1');
	await deleteOrderItem('orderId1', 'productId2');
	await deleteOrderItem('orderId1', 'productId3');
});

test('OrderItemModel: Create existing order item', async () => {
	//1. Create order item
	const orderItem = new OrderItem(
		'orderId1',
		'productId1',
		'userId1',
		1,
		'image',
		'productTitle',
		10
	);

	await createOrderItem(orderItem);

	//2. Create another order item with the same values
	try {
		await createOrderItem(orderItem);
	} catch (error) {
		expect(error).toBeInstanceOf(Error);
		expect(error).toHaveProperty('message', 'The conditional request failed');
	}

	//3. Delete order item
	await deleteOrderItem('orderId1', 'productId1');
});

test('OrderItemModel: Remove item from order', async () => {
	//1. Create order item
	const orderItem = new OrderItem(
		'orderId1',
		'productId1',
		'userId1',
		3,
		'image',
		'productTitle',
		30
	);

	await createOrderItem(orderItem);

	//2. Remove items from order
	await removeItemToOrder('orderId1', 'productId1', 1, 10);

	const orderItem1 = await getOrderItems('orderId1', 'productId1');
	expect(orderItem1.quantity).toEqual(2);
	expect(orderItem1.totalPrice).toEqual(20);

	//3. Delete order item
	await deleteOrderItem('orderId1', 'productId1');
});

test('OrderItemModel: Remove more items from order than exists', async () => {
	//1. Create order item
	const orderItem = new OrderItem(
		'orderId1',
		'productId1',
		'userId1',
		1,
		'image',
		'productTitle',
		10
	);

	await createOrderItem(orderItem);

	//2. Remove items from order
	await removeItemToOrder('orderId1', 'productId1', 2, 12);

	const orderItem1 = await getOrderItems('orderId1', 'productId1');
	expect(orderItem1.quantity).toEqual(-1);
	expect(orderItem1.totalPrice).toEqual(-2);

	//3. Delete order item
	await deleteOrderItem('orderId1', 'productId1');
});
