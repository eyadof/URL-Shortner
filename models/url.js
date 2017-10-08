const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const shortId = require('shortid');
const {isURL} = require('validator');

//only alphabets and numbers as shortId
shortId.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ|!');

const urlSchema = new mongoose.Schema({
	url: {
		type: String,
		required: true,
		validate: {
			isAsync: false,
			validator: value => {
				return isURL(value, {protocols: ['http', 'https']})
			}
		}
	},
	shortId: {
		type: String,
		default: shortId.generate,
		unique: true,
		index: 1
	},
	owner: {
		type: String,
		index: 1
	},
	clicks: {
		type: Number,
		default: 0
	}
}, {
	timestamps: true
});

//statics

/**
 * Lookup url if exists
 * @param {String} shortId - URL hash
 * @returns {Promise} query - mongoose query
 */
urlSchema.statics.lookup = function (shortId) {
	return this.findOne({shortId});
};

/**
 * increment clicks count
 * @param {String} shortId - URL hash
 * @returns {Promise} query - mongoose query
 */
urlSchema.statics.click = function (shortId) {
	//$inc is an atomic operation
	return this.update({shortId}, {$inc: {clicks: 1}})
};

/**
 * get urls by owner
 * @param {ObjectId} ownerId - the id of the required owner
 * @param {Number} page - the current page of url's list starting from 1.
 * @param {Number} limit - the limit of the requested page
 * @returns {Promise} query - mongoose query
 */
urlSchema.statics.findByUserId = function (ownerId, page = 1, limit = 10) {
	return this.find({owner: ownerId}).skip((page - 1) * limit).limit(limit).sort({_id: -1});
};

/**
 * get urls count for a user
 * @param {ObjectId} ownerId - the id of the required owner
 * @returns {Promise} query - mongoose query
 */
urlSchema.statics.countByUserId = function (ownerId) {
	return this.count({owner: ownerId});
};

module.exports = mongoose.model('url', urlSchema);