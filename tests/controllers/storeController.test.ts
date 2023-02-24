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

	const mockedGetProduct = jest.spyOn(productController, 'findProductById');
	mockedGetProduct.mockImplementation((productId): any => {
		return [
			{
				productId: 'productId',
				writeEmail: 'userId1',
				title: 'title',
				description: 'description',
				price: 100,
			},
		];
	});

	const mockedCreateOrderItem = jest.spyOn(orderItems, 'createOrderItem');
	mockedCreateOrderItem.mockImplementation();

	const mockedFindUserByEmailWithCart = jest.spyOn(
		userController,
		'findUserByEmailWithCart'
	);
	mockedFindUserByEmailWithCart.mockImplementation();

	await addProductToCart('userId1', 'productId');

	expect(mockedGetUserCurrentCart).toHaveBeenCalledTimes(1);
	expect(mockedGetProduct).toHaveBeenCalledTimes(1);

	expect(mockedCreateOrderItem).toHaveBeenCalledTimes(1);

	const calledOrderItem = new orderItems.OrderItem(
		'orderId',
		'productId',
		'userId1',
		1,
		100
	);

	expect(mockedCreateOrderItem).toHaveBeenCalledWith(calledOrderItem);
	expect(mockedFindUserByEmailWithCart).toHaveBeenCalledTimes(1);
});

test('StoreController: add existing product to cart', async () => {
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

	const mockedGetProduct = jest.spyOn(productController, 'findProductById');
	mockedGetProduct.mockImplementation((productId): any => {
		return [
			{
				productId: 'productId',
				writeEmail: 'userId1',
				title: 'title',
				description: 'description',
				price: 100,
			},
		];
	});

	const mockedCreateOrderItem = jest.spyOn(orderItems, 'createOrderItem');
	mockedCreateOrderItem.mockImplementation((orderItem): any => {
		throw new Error('The conditional request failed');
	});

	const mockedFindUserByEmailWithCart = jest.spyOn(
		userController,
		'findUserByEmailWithCart'
	);
	mockedFindUserByEmailWithCart.mockImplementation();

	const mockedAddItemToOrder = jest.spyOn(orderItems, 'addItemToOrder');
	mockedAddItemToOrder.mockImplementation();

	await addProductToCart('userId1', 'productId');

	expect(mockedCreateOrderItem).toHaveBeenCalledTimes(1);
	expect(mockedGetUserCurrentCart).toHaveBeenCalledTimes(1);
	expect(mockedAddItemToOrder).toHaveBeenCalledTimes(1);
	expect(mockedAddItemToOrder).toHaveBeenCalledWith(
		'orderId',
		'productId',
		1,
		100
	);
});

test('StoreController: remove product from cart with only 1', async () => {
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

	const mockedDeleteOrderItem = jest.spyOn(orderItems, 'deleteOrderItem');
	mockedDeleteOrderItem.mockImplementation();

	await removeProductFromCart('userId1', 'productId');

	expect(mockedGetUserCurrentCart).toHaveBeenCalledTimes(1);
	expect(mockedDeleteOrderItem).toHaveBeenCalledTimes(1);
	expect(mockedDeleteOrderItem).toHaveBeenCalledWith('orderId', 'productId');
});

test('StoreController: remove product from cart more than 1', async () => {
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

	const mockedDeleteOrderItem = jest.spyOn(orderItems, 'deleteOrderItem');
	mockedDeleteOrderItem.mockImplementation();

	await removeProductFromCart('userId1', 'productId');

	expect(mockedGetUserCurrentCart).toHaveBeenCalledTimes(1);
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
				totalPrice: 1000,
			},
		];
	});

	const mockedFindProductById = jest.spyOn(
		productController,
		'findProductById'
	);
	mockedFindProductById.mockImplementation((productIds): any => {
		return [
			{
				productId: 'productId',
				writeEmail: 'userId1',
				title: 'title',
				description: 'description',
				price: 100,
				images: ['abc'],
			},
		];
	});

	const cartDetail = await getCartInfo('userId1');

	expect(mockedGetUserCurrentCart).toHaveBeenCalledTimes(1);
	expect(mockedGetOrderItems).toHaveBeenCalledTimes(1);
	expect(mockedFindProductById).toHaveBeenCalledTimes(1);
	expect(mockedFindProductById).toHaveBeenCalledWith(['productId']);

	expect(cartDetail.length).toBe(1);
	expect(cartDetail).toEqual([
		{
			title: 'title',
			images: ['abc'],
			quantity: 10,
			price: 1000,
			productId: 'productId',
		},
	]);
});

test('StoreController: but items', async () => {
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
				productId: 'productId1',
				userId: 'userId1',
				quantity: 1,
				totalPrice: 100,
			},
			{
				orderId: 'orderId',
				productId: 'productId2',
				userId: 'userId1',
				quantity: 2,
				totalPrice: 20,
			},
		];
	});

	const mockedUpdateProductSold = jest.spyOn(
		productController,
		'updateProductSold'
	);
	mockedUpdateProductSold.mockImplementation();

	const mockedPurchaseOrder = jest.spyOn(order, 'purchaseOrder');
	mockedPurchaseOrder.mockImplementation();

	const newCart = await buyItems('userId1');

	expect(mockedGetUserCurrentCart).toHaveBeenCalledTimes(1);
	expect(mockedPurchaseOrder).toHaveBeenCalledTimes(1);
	expect(mockedGetOrderItems).toHaveBeenCalledTimes(1);
	expect(mockedUpdateProductSold).toHaveBeenCalledTimes(2);
});
