const app = require('../../app');
const request = require('supertest');
const agent = request.agent(app);
const {createFakeUser} = require('../helpers');
const baseURL = '/api/v1/auth';

describe('Authentications routes tests', () => {
	
	describe('Signup route tests', () => {
		const signupURL = `${baseURL}/signup`;
		it('should not allow signup without email', () => {
			return agent
				.post(signupURL)
				.send({name: 'unlucky user', password: '123456'})
				.expect(400);
		});
		
		it('should not allow signup without name', () => {
			return agent
				.post(signupURL)
				.send({email: 'anonymous@test.com', password: '123456'})
				.expect(400);
		});
		
		it('should not allow signup without password', () => {
			return agent
				.post(signupURL)
				.send({email: 'careless@test.com', name: 'unlucky user'})
				.expect(400);
		});
		
		it('should not allow signing up with invalid mails', () => {
			return agent
				.post(signupURL)
				.send({email: 'very secret', name: 'confidential', password: '12456'})
				.expect(400);
		});
		
		it('should not allow signing up with duplicate mails', () => {
			return createFakeUser().then(users => {
				return agent
					.post(signupURL)
					.send({email: users[0].email, name: 'impostor', password: '12456'})
					.expect(400);
			});
		});
		
		it('should signup user successfully', () => {
			return agent
				.post(signupURL)
				.send({email: 'signmeup@success.com', name: 'good user', password: '123456'})
				.expect(201);
		});
	});
	
	describe('Login route tests', () => {
		const loginURL = `${baseURL}/login`;
		it('should return error if email is not sent', () => {
			return agent
				.post(loginURL)
				.send({password: '123456'})
				.expect(400);
		});
		
		it('should return error if password is not sent', () => {
			return agent
				.post(loginURL)
				.send({email: 'smart@me.com'})
				.expect(400);
		});
		
		it('should return error if email is invalid', () => {
			return agent
				.post(loginURL)
				.send({email: 'cool thing to send'})
				.expect(400);
		});
		
		it('should send token for valid email/password', () => {
			return createFakeUser().then(users => {
				return agent
					.post(loginURL)
					.send({email: users[0].email, password: '123456'})
					.expect(200);
			});
		});
	});
});