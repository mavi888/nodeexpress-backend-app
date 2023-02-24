import { User, registerUser, getUser } from '../models/DynamoDBUser';

import { getCartInfo } from './storeController';

export const registerNewUser = async (userInformation: any) => {
	const email = userInformation.email;
	const name = userInformation.name;

	const user = new User(email, name);
	await registerUser(user);
};

export const findUserByEmailWithCart = async (userEmail: string) => {
	const user = await getUser(userEmail);

	const cart = await getCartInfo(userEmail);

	const result = {
		email: user.email,
		name: user.name,
		lastname: user.lastname,
		cart: cart,
	};
	return result;
};
