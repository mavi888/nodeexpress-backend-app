import { User, registerUser } from '../models/DynamoDBUser';

export const registerNewUser = async (userInformation: any) => {
	const email = userInformation.email;
	const name = userInformation.name;

	const user = new User(email, name);
	await registerUser(user);
};
