const faker = require('faker');
const jwt = require('jsonwebtoken');
const {ObjectId} = require('mongoose').Types;
const models = require('../models');

module.exports.createFakeUser = (count = 1, userData = []) => {
	const promises = [];
	for (let i = 0; i < count; i++) {
		const data = userData[i] || {};
		const email = data.email || faker.internet.email();
		const name = data.name || faker.name.findName();
		const password = data.password || '123456';
		promises.push(models.user.create({email, name, password}));
	}
	return Promise.all(promises);
};

module.exports.createFakeUrl = (count = 1, userData = []) => {
	const promises = [];
	for (let i = 0; i < count; i++) {
		const data = userData[i] || {};
		const url = data.url || faker.internet.url();
		const owner = data.owner || ObjectId();
		promises.push(models.url.create({url, owner}));
	}
	return Promise.all(promises);
};

module.exports.createFakeToken = () => {
	return new Promise((resolve, reject) => {
		const id = ObjectId();
		jwt.sign({id}, process.env.JWT_SECRET, (error, token) => {
			if (error)
				return reject(error);
			return resolve({id, token});
		});
	});
};

module.exports.fakeId = () => {
	return ObjectId();
};
