const app = require('../../app');
const request = require('supertest');
const agent = request.agent(app);
const {createFakeToken} = require('../helpers');


describe('Url shortening/deflating and management APIs', () => {
	const baseURL = '/api/v1/urls';
	describe('Url shortening tests', () => {
		it('should not accept empty urls', () => {
			return agent
				.post(baseURL)
				.expect(400);
		});
		
		it('should not allow invalid urls', () => {
			return agent
				.post(baseURL)
				.expect(400);
		});
		
		it('should shorten a given url', () => {
			return agent
				.post(baseURL)
				.send({url: 'https://shortenme.com'})
				.expect(201);
		});
		
		it('should assign url to current logged in user', () => {
			return createFakeToken().then(({id, token}) => {
				return agent
					.post(baseURL)
					.set('authorization', `JWT ${token}`)
					.send({url: 'https://someone.willown.me'})
					.expect(201);
			});
		});
		
	});
});