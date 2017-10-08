const mongoose = require('mongoose');

//set mongoose default promise library
mongoose.Promise = Promise;

//events
mongoose.connection.on('error', error => {
	//TODO log this
});

//connect to database by default
if (process.env.DB_URL)
	mongoose.connect(process.env.DB_URL, {
		useMongoClient: true
	});

//export models
module.exports = {
	url: require('./url'),
	user: require('./user')
};