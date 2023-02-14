import { User, registerUser } from '../models/DynamoDBUser';

export const registerNewUser = async (userInformation: any) => {
	const email = userInformation.email;
	const name = userInformation.name;

	console.log('register new user');
	console.log(userInformation);
	const user = new User(email, name);
	console.log(user);
	await registerUser(user);
};
