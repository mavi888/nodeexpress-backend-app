import { Express, Request, Response } from 'express';
import {
	addProduct,
	findProductWithQuery,
	findProductById,
} from '../controllers/productController';

const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');

router.post('/uploadProduct', auth, async (req: Request, res: Response) => {
	const productDetail = req.body;

	try {
		await addProduct(productDetail);
		return res.status(200).json({ success: true });
	} catch (error) {
		return res.status(400).json({ success: false, error });
	}
});

/*
1. Basic get product where we want to populate the first 8 in the screen.
{
	limit:8,
	skip: 0
}
2. Load more pressed
{
	filters: 
		{category: [], price: []}
	limit:  8
	loadMore:  true
	searchTerm : ""
	skip: 8
}
3. Query on category 
{
	filters: 
		{category: [1], price: []}
	limit:  8
	loadMore:  true
	searchTerm : ""
	skip: 8
}
3. Query on category and price 
{
	filters: 
		{category: [1], price: [0, 199]}
	limit:  8
	loadMore:  true
	searchTerm : ""
	skip: 8
}
4. Query on category price and search term
{
	filters: 
		{category: [1], price: [0, 199]}
	limit:  8
	loadMore:  true
	searchTerm : "lambda"
	skip: 8
}
*/

router.post('/getProducts', async (req: Request, res: Response) => {
	let filters = req.body.filters;

	const price = filters.price;
	const category = filters.category;
	let term = req.body.searchTerm;

	try {
		const products = await findProductWithQuery(price, category, term);
		return res
			.status(200)
			.json({ success: true, products, postSize: products.length });
	} catch (err) {
		return res.status(400).json({ success: false, err });
	}
});
/*
 ?id=${productId}&type=single
 ?id=12121212,121212,1212121 type=array
 */

router.get('/products_by_id', async (req: Request, res: Response) => {
	const type = req.query.type;
	const productIds = req.query.id?.toString();

	let productIdsArray: string[] = [];

	if (type === 'array' && productIds != undefined) {
		productIdsArray = productIds.split(',');
	}

	try {
		const products = await findProductById(productIdsArray);
		return res.status(200).send(products);
	} catch (err) {
		return res.status(400).send(err);
	}
});

module.exports = router;
