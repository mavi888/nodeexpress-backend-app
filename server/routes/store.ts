import { Express, Request, Response } from 'express';

const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

import { User } from '../models/DynamoDBUser';

import {
	addProductToCart,
	removeProductFromCart,
	getCartInfo,
	buyItems,
	getHistory,
} from '../controllers/storeController';

router.get('/addToCart', auth, async (req: any, res: Response) => {
	const user = req.user;
	const productId = req.query.productId;
	const productTitle = req.query.productTitle;
	const productImage = req.query.productImage;
	const price = parseInt(req.query.price);

	try {
		const userUpdated = await addProductToCart(
			user,
			productId,
			productTitle,
			productImage,
			price
		);
		return res.status(200).json(userUpdated.cart);
	} catch (err) {
		return res.json({ success: false, err });
	}
});

router.get('/removeFromCart', auth, async (req: any, res: Response) => {
	const user = req.user;
	const itemIdToRemove = req.query._id;

	try {
		const r = await removeProductFromCart(user, itemIdToRemove);
		return res.status(200).json(r);
	} catch (err) {
		return res.json({ success: false, err });
	}
});

router.get('/userCartInfo', auth, async (req: any, res: Response) => {
	const userId = req.user.email;

	try {
		const cartDetail = await getCartInfo(userId);
		return res.status(200).json({ success: true, cartDetail, undefined });
	} catch (err) {
		return res.status(400).send(err);
	}
});

router.post('/successBuy', auth, async (req: any, res: Response) => {
	const user = req.user;

	try {
		const cart = await buyItems(user);

		return res.status(200).json({
			success: true,
			cart: cart,
			cartDetail: [],
		});
	} catch (err) {
		return res.json({ success: false, err });
	}
});

router.get('/getHistory', auth, async (req: any, res: Response) => {
	const userId = req.user.email;

	try {
		const history = await getHistory(userId);
		return res.status(200).json({ success: true, history });
	} catch (err) {
		return res.status(400).send(err);
	}
});

module.exports = router;
