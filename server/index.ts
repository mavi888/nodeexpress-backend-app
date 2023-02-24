import { Express, Request, Response } from 'express';

const express = require('express');

const app = express();
const path = require('path');
const cors = require('cors');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');
require('dotenv').config();

// SET UP SERVER
console.log('Setting CORS');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// SET UP ROUTES

app.get('/', (req: Request, res: Response) => {
	res.send('Hi there!');
});
app.use('/api/users', require('./routes/users'));
app.use('/api/product', require('./routes/product'));
app.use('/api/store', require('./routes/store'));

// START SERVER
const port = process.env.PORT || 8080;

app.listen(port, () => {
	console.log(`Server Running at ${port}`);
});
