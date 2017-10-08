const {isURL} = require('validator');
const {parameterRequired, parameterInvalid} = require('../../errors');

module.exports.create = (req, res, next) => {
	const url = req.body.url;
	if (!url)
		return next(parameterRequired('url'));
	if (!isURL(url, {protocols: ['http', 'https']}))
		return next(parameterInvalid('url'));
	return next();
};