import {
	OrderItem,
	createOrderItem,
	getOrderItems,
	deleteOrderItem,
	addItemToOrder,
} from '../../server/models/DynamoDBOrderItems';

test('OrderItemModel: CRUD operations on order item', async () => {
	//1. Create order item
	const orderItem = new OrderItem('orderId1', 'productId1', 'userId1', 1, 10);

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

test('OrderItemModel: Add item to order', async () => {
	//1. Create order item
	const orderItem = new OrderItem('orderId1', 'productId1', 'userId1', 1, 10);

	await createOrderItem(orderItem);

	//2.Add item to order"
	await addItemToOrder('orderId1', 'productId1', 2, 20);

	const orderItem1 = await getOrderItems('orderId1', 'productId1');
	expect(orderItem1.quantity).toEqual(3);
	expect(orderItem1.totalPrice).toEqual(30);

	//3. Delete order item
	await deleteOrderItem('orderId1', 'productId1');
});
