import {
	addProductToCart,
	removeProductFromCart,
	getCartInfo,
	buyItems,
} from '../../server/controllers/storeController';

import * as order from '../../server/models/DynamoDBOrder';
import * as orderItems from '../../server/models/DynamoDBOrderItems';
import * as productController from '../../server/controllers/productController';
import * as userController from '../../server/controllers/userController';

test('StoreController: add new product to cart', async () => {
	jest.clearAllMocks();

	const mockedCreateOrderItem = jest.spyOn(orderItems, 'createOrderItem');
	mockedCreateOrderItem.mockImplementation();

	const mockedGetUpdatedUserWithCart = jest.spyOn(
		userController,
		'getUpdatedUserWithCart'
	);
	mockedGetUpdatedUserWithCart.mockImplementation();

	const userWithCart = {
		orderId: 'orderId',
		email: 'email@test.com',
	};

	await addProductToCart(userWithCart, 'productId', 'image', 'title', 32);

	expect(mockedCreateOrderItem).toHaveBeenCalledTimes(1);

	const calledOrderItem = new orderItems.OrderItem(
		'orderId',
		'productId',
		'email@test.com',
		1,
		'title',
		'image',
		32
	);

	expect(mockedCreateOrderItem).toHaveBeenCalledWith(calledOrderItem);
	expect(mockedGetUpdatedUserWithCart).toHaveBeenCalledTimes(1);
});

test('StoreController: add existing product to cart', async () => {
	jest.clearAllMocks();

	const mockedCreateOrderItem = jest.spyOn(orderItems, 'createOrderItem');
	mockedCreateOrderItem.mockImplementation((orderItem): any => {
		throw new Error('The conditional request failed');
	});

	const mockedAddItemToOrder = jest.spyOn(orderItems, 'addItemToOrder');
	mockedAddItemToOrder.mockImplementation();

	const mockedGetUpdatedUserWithCart = jest.spyOn(
		userController,
		'getUpdatedUserWithCart'
	);
	mockedGetUpdatedUserWithCart.mockImplementation();

	const userWithCart = {
		orderId: 'orderId',
		email: 'email@test.com',
	};

	await addProductToCart(userWithCart, 'productId', 'title', 'image', 3);

	expect(mockedCreateOrderItem).toHaveBeenCalledTimes(1);
	expect(mockedAddItemToOrder).toHaveBeenCalledTimes(1);
	expect(mockedAddItemToOrder).toHaveBeenCalledWith(
		'orderId',
		'productId',
		1,
		3
	);
});

test('StoreController: remove product from cart with only 1', async () => {
	jest.clearAllMocks();

	const userWithCart = {
		orderId: 'orderId',
		email: 'email@test.com',
	};

	const mockedDeleteOrderItem = jest.spyOn(orderItems, 'deleteOrderItem');
	mockedDeleteOrderItem.mockImplementation();

	await removeProductFromCart(userWithCart, 'productId');

	expect(mockedDeleteOrderItem).toHaveBeenCalledTimes(1);
	expect(mockedDeleteOrderItem).toHaveBeenCalledWith('orderId', 'productId');
});

test('StoreController: remove product from cart more than 1', async () => {
	jest.clearAllMocks();

	const userWithCart = {
		orderId: 'orderId',
		email: 'email@test.com',
	};

	const mockedDeleteOrderItem = jest.spyOn(orderItems, 'deleteOrderItem');
	mockedDeleteOrderItem.mockImplementation();

	await removeProductFromCart(userWithCart, 'productId');

	expect(mockedDeleteOrderItem).toHaveBeenCalledTimes(1);
	expect(mockedDeleteOrderItem).toHaveBeenCalledWith('orderId', 'productId');
});

test('StoreController: get cart info', async () => {
	jest.clearAllMocks();

	const mockedGetUserCurrentCart = jest.spyOn(order, 'getUserCurrentCart');
	mockedGetUserCurrentCart.mockImplementation((userId): any => {
		return [
			{
				orderId: 'orderId',
				userId: 'userId1',
				date: 'abc',
				status: 'CURRENT',
			},
		];
	});

	const mockedGetOrderItems = jest.spyOn(orderItems, 'getOrderItemsByOrderId');
	mockedGetOrderItems.mockImplementation((orderId): any => {
		return [
			{
				orderId: 'orderId',
				productId: 'productId',
				userId: 'userId1',
				quantity: 10,
				productTitle: 'title',
				productImage: 'image',
				totalPrice: 1000,
			},
		];
	});
	const cartDetail = await getCartInfo('userId1');

	expect(mockedGetUserCurrentCart).toHaveBeenCalledTimes(1);
	expect(mockedGetOrderItems).toHaveBeenCalledTimes(1);
	expect(cartDetail.cartDetail.length).toBe(1);
	expect(cartDetail.cartDetail).toEqual([
		{
			title: 'title',
			images: 'image',
			quantity: 10,
			price: 1000,
			productId: 'productId',
		},
	]);
});

test('StoreController: buy items', async () => {
	jest.clearAllMocks();

	const mockedUpdateProductSold = jest.spyOn(
		productController,
		'updateProductSold'
	);
	mockedUpdateProductSold.mockImplementation();

	const mockedPurchaseOrder = jest.spyOn(order, 'purchaseOrder');
	mockedPurchaseOrder.mockImplementation();

	const userWithCart = {
		orderId: 'orderId',
		email: 'email@test.com',
		cart: [
			{
				productId: 'product1',
				quantity: 1,
				price: 10,
			},
			{
				productId: 'product2',
				quantity: 2,
				price: 20,
			},
		],
	};

	const newCart = await buyItems(userWithCart);

	expect(mockedPurchaseOrder).toHaveBeenCalledTimes(1);
	expect(mockedUpdateProductSold).toHaveBeenCalledTimes(2);
});
