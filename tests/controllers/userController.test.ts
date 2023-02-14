import { registerNewUser } from '../../server/controllers/userController';

import * as user from '../../server/models/DynamoDBUser';

test('UserController: register new user', async () => {
	const input = {
		email: 'test@gmail.com',
		image: 'http://gravatar.com/avatar/1676390076?d=identicon',
		name: 'marcia',
		password: 'xxxx',
	};

	const mockedRegister = jest.spyOn(user, 'registerUser');

	mockedRegister.mockImplementation();

	await registerNewUser(input);

	const inputUser = {
		name: 'marcia',
		email: 'test@gmail.com',
		lastname: '',
		role: '0',
	};

	expect(mockedRegister).toHaveBeenCalled();
	expect(mockedRegister).toHaveBeenCalledWith(inputUser);
});
