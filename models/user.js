const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		index: 1,
		validate: {
			isAsync: false, //in order to clear the warning
			validator: isEmail
		}
	},
	password: {
		type: String,
		required: true,
		select: 0 //do not return the password field when fetching/populating the user object
	},
	name: {
		type: String,
		required: true
	}
}, {
	timestamps: true
});

//hooks

//hook for rehash password when it's changed
//do not use ES6 arrow function this won't get bind to the right context
userSchema.pre('save', function (next) {
	if (this.isNew || this.isModified('password')) {
		bcrypt.genSalt(12, (error, salt) => {
			if (error)
				return next(error);
			bcrypt.hash(this.password, salt, (error, hash) => {
				if (error)
					return next(error);
				this.password = hash;
				next();
			});
		});
	}
	else {
		next();
	}
});

//methods
userSchema.methods.comparePassword = function (password) {
	return new Promise((resolve, reject) => {
		bcrypt.compare(password, this.password, (error, result) => {
			if (error)
				return reject(error);
			resolve(result);
		});
	});
};

module.exports = mongoose.model('user', userSchema);