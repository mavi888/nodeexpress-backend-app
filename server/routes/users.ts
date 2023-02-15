import { Express, Request, Response } from 'express';

const express = require('express');
const router = express.Router();

const { auth } = require('../middleware/auth');

import { registerNewUser } from '../controllers/userController';

// TODO
router.get('/auth', auth, (req: any, res: Response) => {
	res.status(200).json({
		_id: req.user._id,
		isAdmin: req.user.role === 0 ? false : true,
		isAuth: true,
		email: req.user.email,
		name: req.user.name,
		lastname: req.user.lastname,
		role: req.user.role,
		image: req.user.image,
		cart: req.user.cart,
		history: req.user.history,
	});
});

/*
{
  "email" :  "test@gmail.com",
  "image" :  "http://gravatar.com/avatar/1676390076?d=identicon",
  "name" :  "marcia",
  "password" :  "Tomate1234@"
}
*/
router.post('/register', async (req: Request, res: Response) => {
	const userInformation = req.body;

	try {
		await registerNewUser(userInformation);
		return res.status(200).json({
			success: true,
		});
	} catch (err) {
		return res.json({ success: false, err });
	}
});

module.exports = router;
