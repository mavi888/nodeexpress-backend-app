//const { Product } = require("../models/Product");

import {
	Product,
	createProduct,
	getProduct,
	getAllProducts,
	findProductByTitle,
	filterProductByPrice,
	findProductsByCategory,
} from '../models/DynamoDBProduct';
import { ulid } from 'ulid';

/*
    category :  "5"
    description :  "test description"
    images :  ["uploads/image (6).png"]
    price : "122"
    title:  "test title"
    writer:  "63d8274d37c7f13e069618a2"
*/
export const addProduct = async (productData: any) => {
	const product = new Product(
		ulid(),
		productData.writer,
		productData.title,
		productData.price,
		productData.description,
		productData.images,
		productData.category
	);
	await createProduct(product);
	return product;
};

export const findProductWithQuery = async (
	category?: any[],
	term?: string,
	iPrice?: number,
	fPrice?: number
) => {
	if (term != undefined && term != '') {
		// TODO NEED TO APPLY FILTERS to the search term
		return findProductByTitle(term);
	}

	if (iPrice != undefined && fPrice != undefined) {
		// TODO NEED TO APPLY FILTERS ON CATEGORY AND Search term
		return filterProductByPrice(iPrice, fPrice);
	}

	if (category != undefined && category.length > 0) {
		const products = Promise.all(
			category.map(async (c) => {
				const prod = await findProductsByCategory(c);
				return prod;
			})
		);

		// TODO NEED TO APPLY FILTERS ON PRICE AND Search term
		return products;
	}

	// No filters applied
	return getAllProducts();
};

export const findProductById = async (productIds: string[]) => {
	const products = Promise.all(
		productIds.map(async (id) => {
			const prod = await getProduct(id);
			return prod;
		})
	);

	return products;
};

/*
updateProductQuantity = async (productId, quantity) => {
    await Product.updateOne({ _id: productId }, 
        {
            $inc: {
                "sold": quantity
            }
        },
        { new: false })
}

module.exports = {
    addProduct,
    findProductsWithQuery,
    findProductById,
    updateProductQuantity
}*/
