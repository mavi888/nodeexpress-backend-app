import {
	Order,
	createOrder,
	getUserCurrentCart,
	getUserHistory,
	purchaseOrder,
} from '../models/DynamoDBOrder';
import {
	OrderItem,
	createOrderItem,
	addItemToOrder,
	deleteOrderItem,
	getOrderItemsByOrderId,
} from '../models/DynamoDBOrderItems';

import { findProductById, updateProductSold } from './productController';
import { findUserByEmailWithCart } from './userController';
import { ulid } from 'ulid';

export const addProductToCart = async (userId: string, productId: string) => {
	let userCartId = await getUserCurrentCart(userId);

	if (userCartId.length <= 0) {
		//Create a new order with the status current
		const newOrder = new Order(ulid(), userId);
		await createOrder(newOrder);
		userCartId.push(newOrder);
	}
	const products = await findProductById([productId]);
	// try to add the order item if it fails then update the order item
	const newOrderItem = new OrderItem(
		userCartId[0].orderId,
		productId,
		userId,
		1,
		products[0].price
	);

	try {
		await createOrderItem(newOrderItem);
	} catch (error) {
		if (
			error instanceof Error &&
			error.message === 'The conditional request failed'
		) {
			await addItemToOrder(
				userCartId[0].orderId,
				productId,
				1,
				products[0].price
			);
		}
	} finally {
		return await findUserByEmailWithCart(userId);
	}
};

export const removeProductFromCart = async (
	userId: string,
	productId: string
) => {
	const userCartId = await getUserCurrentCart(userId);

	await deleteOrderItem(userCartId[0].orderId, productId);
	return await findUserByEmailWithCart(userId);
};

export const getCartInfo = async (userId) => {
	const userCartId = await getUserCurrentCart(userId);

	let cartDetail: any[] = [];
	// The user doesn't have a current order asociated
	if (userCartId.length <= 0) {
		//Create a new order with the status current
		const newOrder = new Order(ulid(), userId);
		await createOrder(newOrder);
		userCartId.push(newOrder);
	} else {
		const orderItemsFromCart = await getOrderItemsByOrderId(
			userCartId[0].orderId
		);

		cartDetail = await Promise.all(
			orderItemsFromCart.map(async (item) => {
				const product = await findProductById([item.productId]);
				return {
					productId: item.productId,
					title: product[0].title,
					images: product[0].images,
					quantity: item.quantity,
					price: item.totalPrice,
				};
			})
		);
	}
	return cartDetail;
};

// TODO NEED TO BUILD THIS AS A DYNAMODB TRANSACTION with the purchase order
export const buyItems = async (userId) => {
	const userCartId = await getUserCurrentCart(userId);

	// If we want to add a payment system we can add it here.

	let totalPrice = 0;
	let totalQuantity = 0;

	//Increase the amount of number for the sold information
	const orderItems = await getOrderItemsByOrderId(userCartId[0].orderId);

	await Promise.all(
		orderItems.map(async (item) => {
			await updateProductSold(item.productId, item.quantity);
			totalPrice = totalPrice + item.totalPrice;
			totalQuantity = totalQuantity + item.quantity;
		})
	);

	const date = new Date().valueOf().toString();
	await purchaseOrder(userCartId[0].orderId, date, totalPrice, totalQuantity);

	return await findUserByEmailWithCart(userId);
};

export const getHistory = async (userId) => {
	const userHistory = await getUserHistory(userId);
	return userHistory;
};
