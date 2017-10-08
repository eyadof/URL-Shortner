const {isEmail} = require('validator');
const {parameterRequired, parameterInvalid} = require('../../errors');

module.exports.signup = (req, res, next) => {
	//check if email is sent
	if (!req.body.email)
		return next(parameterRequired('email'));
	//check if name is sent
	if (!req.body.name)
		return next(parameterRequired('name'));
	//check if password is sent
	if (!req.body.password)
		return next(parameterRequired('password'));
	//check if email is valid
	if (!isEmail(req.body.email))
		return next(parameterInvalid('email'));
	//every thing is ok
	return next();
};

module.exports.login = (req, res, next) => {
	//check if email is sent
	if (!req.body.email)
		return next(parameterRequired('email'));
	//check if password is sent
	if (!req.body.password)
		return next(parameterRequired('password'));
	//check if email is valid
	if (!isEmail(req.body.email))
		return next(parameterInvalid('email'));
	//every thing is ok
	return next();
};