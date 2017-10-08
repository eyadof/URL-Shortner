const should = require('chai').should();
const Url = require('../../models').url;
const {createFakeUrl, fakeId} = require('../helpers');

describe('Url model tests', () => {
	describe('Validation and default values tests', () => {
		it('should not accept empty urls', () => {
			const url = new Url({count: 1});
			return url.validate()
				.then(() => {
					return Promise.reject('Object should not pass validate!');
				})
				.catch(error => {
					should.exist(error.errors.url);
					error.errors.url.message.should.equal('Path \`url\` is required.');
					return Promise.resolve();
				});
		});
		
		it('should allow only valid urls', () => {
			const url = new Url({url: 'random thing'});
			return url.validate()
				.then(() => {
					return Promise.reject('Object should not pass validate!');
				})
				.catch(error => {
					should.exist(error.errors.url);
					error.errors.url.message.should.match(/^Validator failed for path `url`.*/);
					return Promise.resolve();
				});
		});
		
		it('should auto-generate shortId', () => {
			const url = new Url({url: 'https://google.com'});
			should.exist(url.shortId);
		});
	});
	
	describe('Url statics and methods tests', () => {
		it('should lookup url by hashId', () => {
			return createFakeUrl().then(urls => {
				return Url.lookup(urls[0].shortId).then(url => {
					should.exist(url);
					url.should.be.an('object');
					url.url.should.equal(urls[0].url);
				});
			});
		});
		
		it('should increment clicks with 1', () => {
			return createFakeUrl().then(urls => {
				return Url.click(urls[0].shortId).then(results => {
					results.ok.should.equal(1);
					results.nModified.should.equal(1);
					return Url.findOne({_id: urls[0].id}).then(url => {
						should.exist(url);
						url.shortId.should.equal(urls[0].shortId);
						url.clicks.should.equal(1);
					});
				});
			});
		});
		
		it('should return list of links owned by a user', () => {
			const id = fakeId();
			return createFakeUrl(2, [{owner: id}, {owner: id}]).then(() => {
				return Url.findByUserId(id).then(urls => {
					urls.length.should.equal(2);
				});
			});
		});
		
		it('should take page and limit parameters', () => {
			const id = fakeId();
			const fakeData = [
				{owner: id},
				{owner: id, url: 'https://seconde.me'}
			];
			return createFakeUrl(2, fakeData).then(() => {
				return Url.findByUserId(id, 2, 1).then(urls => {
					urls.should.be.an('array');
					urls[0].url.should.equal('https://seconde.me');
					urls.length.should.equal(1);
				});
			});
		});
		
		it('should return links count owned by a user', () => {
			const id = fakeId();
			const fakeData = [
				{owner: id},
				{owner: id},
				{owner: id},
				{owner: id}
			];
			return createFakeUrl(4, fakeData).then(() => {
				return Url.countByUserId(id).then(count => {
					count.should.be.a('number');
					count.should.equal(4);
				});
			});
		});
	});
})
;

after(() => {
	return Url.remove({});
});