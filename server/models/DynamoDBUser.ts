import { Item, createItem, getItem, deleteItem } from './base';

export class User extends Item {
	name: string;
	email: string;
	lastname: string;
	role: string;

	constructor(email: string, name?: string, lastname?: string) {
		super();
		this.name = name || '';
		this.email = email;
		this.lastname = lastname || '';
		this.role = '0';
	}

	get pk(): string {
		return `USER#${this.email}`;
	}

	get sk(): string {
		return `USER#${this.email}`;
	}

	static fromItem(item?: any): User {
		if (!item) throw new Error('No item');

		return new User(item.email, item.name, item.lastname);
	}

	toItem(): Record<any, unknown> {
		return {
			...this.keys(),
			name: this.name,
			email: this.email,
			lastname: this.lastname,
			role: this.role,
		};
	}
}

export const registerUser = async (user: User) => {
	return await createItem(user);
};

export const getUser = async (email: string) => {
	const user = new User(email);

	try {
		const response = await getItem(user);
		return User.fromItem(response.Item);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const deleteUser = async (email: string) => {
	const user = new User(email);

	try {
		const response = await deleteItem(user);
		return response;
	} catch (error) {
		console.log(error);
		throw error;
	}
};
