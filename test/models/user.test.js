const mongoose = require('mongoose');
mongoose.Promise = Promise;
const User = require('../../models').user;
const should = require('chai').should();
const {createFakeUser} = require('../helpers');

describe('User model tests', () => {
	describe('Validation and default values tests', () => {
		it('should not accept empty emails', () => {
			const user = User({name: 'test user', password: '123456'});
			return user.validate()
				.then(() => {
					return Promise.reject('User object should not get created without email!');
				})
				.catch(error => {
					should.exist(error.errors.email);
					error.errors.email.message.should.equal('Path \`email\` is required.');
					return Promise.resolve();
				});
		});
		
		it('should not accept invalid emails', () => {
			const user = User({email: 'funny.me', name: 'test user', password: '123456'});
			return user.validate()
				.then(() => {
					return Promise.reject('User object should not get created with invalid email!');
				})
				.catch(error => {
					should.exist(error.errors.email);
					error.errors.email.message.should.equal('Validator failed for path \`email\` with value \`funny.me\`');
					return Promise.resolve();
				});
		});
		
		it('should not accept empty names', () => {
			const user = User({email: 'test@test.com', password: '123456'});
			return user.validate()
				.then(() => {
					return Promise.reject('User object should not get created without name!');
				})
				.catch(error => {
					should.exist(error.errors.name);
					error.errors.name.message.should.equal('Path \`name\` is required.');
					return Promise.resolve();
				});
		});
		
		it('should not accept empty passwords', () => {
			const user = User({email: 'test@test.com', name: 'test user'});
			return user.validate()
				.then(() => {
					return Promise.reject('User object should not get created without password!');
				})
				.catch(error => {
					should.exist(error.errors.password);
					error.errors.password.message.should.equal('Path \`password\` is required.');
					return Promise.resolve();
				});
		});
		
		describe('hooks and methods tests', () => {
			
			
			it('should auto-generate hash for password before saving newly created users', () => {
				const email = 'test-hash@test.com';
				const name = 'test user';
				const password = '123456';
				return User.create({email, name, password}).then(user => {
					user.password.should.not.equal('123456');
				});
			});
			
			it('should regenerate hash for password', () => {
				return createFakeUser(1, [{password: '123456'}]).then(users => {
					const hash = users[0].password;
					hash.should.not.equal('123456');
					users[0].password = '789123';
					return users[0].save().then(user => {
						user.password.should.not.equal('789123');
						user.password.should.not.equal(hash);
					});
				});
			});
			
			it('should compare passwords correctly', () => {
				return createFakeUser(1, [{password: '123456'}])
					.then(users => {
						users[0].comparePassword('123456').then(result => {
							result.should.be(Boolean);
							result.should.equal(true);
						});
					});
			});
		});
	});
});

after(() => {
	return User.remove({});
});