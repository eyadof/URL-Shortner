const Url = require('../models').url;

module.exports.create = (req, res, next) => {
	const url = req.body.url;
	const owner = res.locals.user;
	//check if owner has shorten the same url before
	if (owner)
		Url.findOne({url, owner}).then(previousEntry => {
			if (previousEntry)
				return res.json(previousEntry);
			//create new entry
			return Url.create({url, owner}).then(url => {
				return res.status(201).json(url);
			});
		}).catch(next);
	else {
		Url.create({url}).then(url => {
			return res.status(201).json(url);
		}).catch(next);
	}
};

module.exports.lookup = (req, res, next) => {
	const shortId = req.params.shortId;
	Url.lookup(shortId).then(url => {
		if (!url) {
			//this will continue to 404 router
			return next();
		}
		//redirect the user
		res.redirect(url.url);
		//count the click
		//this task is fully async
		Url.click(shortId).catch(error => {
			//TODO log this
			console.log(error);
		});
	}).catch(next);
};

module.exports.list = (req, res, next) => {
	//NaN || 1 will evaluate to 1
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;
	const owner = res.locals.user;
	//fetch total count and current page
	const promises = [Url.findByUserId(owner, page, limit), Url.countByUserId(owner)];
	Promise.all(promises)
		.then(results => {
			return res.json({
				data: results[0],
				paging: {
					current: page,
					total: results[1]
				}
			})
		})
		.catch(next);
};