const {randomBytes} = require('crypto');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const {parameterUsed, invalidCredentials} = require('../errors');

const sign = (id, callback) => {
	jwt.sign({id}, process.env.JWT_SECRET, callback);
};

module.exports.signup = (req, res, next) => {
	const {email, password, name} = req.body;
	//check that email is unique
	User.findOne({email}).then(user => {
		if (user)
			return next(parameterUsed('email', email));
		User.create({email, name, password}).then(user => {
			sign(user.id, (error, token) => {
				if (error) {
					return next(error);
				}
				return res.status(201).json({
					email: user.email,
					name: user.name,
					token
				});
			});
		}).catch(next);
	});
};

module.exports.login = (req, res, next) => {
	const {email, password} = req.body;
	//lookup user by email
	//explicitly ask for password field
	User.findOne({email}, {password: 1}).then(user => {
		if (!user)
			return next(invalidCredentials());
		//check for password
		return user.comparePassword(password).then(result => {
			if (!result)
				return next(invalidCredentials());
			//sign token and send response
			sign(user.id, (error, token) => {
				if (error)
					return next(error);
				return res.json({
					name: user.name,
					email: user.email,
					token
				});
			});
		});
	}).catch(next);
};

module.exports.registerAnonymous = (req, res, next) => {
	const id = randomBytes(20).toString('hex');
	jwt.sign({id}, process.env.JWT_SECRET, (error, token) => {
		if (error)
			return next(error);
		return res.status(201).json({token});
	})
};

module.exports.extractUser = (req, res, next) => {
	if (!req.headers.authorization)
		return next();
	try {
		//Authorization header example: JWT 123546543
		const [_, token] = req.headers.authorization.split(' ');
		jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
			if (error)
				return next(error);
			//setup user to be the current user id.
			res.locals.user = payload.id;
			return next();
		});
	}
	catch (error) {
		return next();
	}
};