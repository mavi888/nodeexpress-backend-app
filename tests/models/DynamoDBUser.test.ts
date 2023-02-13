import {
	User,
	registerUser,
	getUser,
	deleteUser,
} from '../../server/models/DynamoDBUser';

test('UserModel: CRUD operations on a user', async () => {
	//1. Create the user
	const user = new User('email', 'name', 'lastName');

	await registerUser(user);

	//2. Get the user
	const userReturned = await getUser('email');
	expect(userReturned.email).toBe('email');

	//3.Delete the product
	await deleteUser('email');

	try {
		await getUser('email');
	} catch (error) {
		expect(error).toBeInstanceOf(Error);
		expect(error).toHaveProperty('message', 'No item');
	}
});
