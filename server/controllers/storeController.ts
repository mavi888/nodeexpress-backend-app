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

import { updateProductSold } from './productController';
import { getUpdatedUserWithCart } from './userController';
import { ulid } from 'ulid';

export const addProductToCart = async (
	userWithCart: any,
	productId: string,
	productTitle: string,
	productImage: string,
	price: number
) => {
	// try to add the order item if it fails then update the order item
	const newOrderItem = new OrderItem(
		userWithCart.orderId,
		productId,
		userWithCart.email,
		1,
		productImage,
		productTitle,
		price
	);
	try {
		await createOrderItem(newOrderItem);
	} catch (error) {
		if (
			error instanceof Error &&
			error.message === 'The conditional request failed'
		) {
			await addItemToOrder(userWithCart.orderId, productId, 1, price);
		}
	} finally {
		return await getUpdatedUserWithCart(
			userWithCart.email,
			userWithCart.name,
			userWithCart.lastname
		);
	}
};

export const removeProductFromCart = async (
	userWithCart: any,
	productId: string
) => {
	await deleteOrderItem(userWithCart.orderId, productId);

	return await getUpdatedUserWithCart(
		userWithCart.email,
		userWithCart.name,
		userWithCart.lastname
	);
};

export const getCartInfo = async (userId) => {
	const currentOrder = await getUserCurrentCart(userId);

	let cartDetail: any[] = [];

	// The user doesn't have a current order asociated
	if (currentOrder.length <= 0) {
		//Create a new order with the status current
		const newOrder = new Order(ulid(), userId);
		await createOrder(newOrder);
		currentOrder.push(newOrder);
	} else {
		const orderItemsFromCart = await getOrderItemsByOrderId(
			currentOrder[0].orderId
		);

		cartDetail = orderItemsFromCart.map((item) => {
			return {
				productId: item.productId,
				title: item.productTitle,
				images: item.productImage,
				quantity: item.quantity,
				price: item.totalPrice,
			};
		});
	}
	const result = {
		orderId: currentOrder[0].orderId,
		cartDetail: cartDetail,
	};

	return result;
};

// TODO NEED TO BUILD THIS AS A DYNAMODB TRANSACTION with the purchase order
export const buyItems = async (user) => {
	// If we want to add a payment system we can add it here.

	let totalPrice = 0;
	let totalQuantity = 0;

	//Increase the amount of number for the sold information
	await Promise.all(
		user.cart.map(async (item) => {
			await updateProductSold(item.productId, item.quantity);
			totalPrice = totalPrice + item.price;
			totalQuantity = totalQuantity + item.quantity;
		})
	);

	const date = new Date().valueOf().toString();

	await purchaseOrder(
		user.email,
		user.orderId,
		date,
		totalPrice,
		totalQuantity
	);

	return await getUpdatedUserWithCart(user.email, user.name, user.lastname);
};

export const getHistory = async (userId) => {
	const userHistory = await getUserHistory(userId);
	return userHistory;
};
