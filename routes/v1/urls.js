const {Router} = require('express');
const router = Router();
const validators = require('../../middlewares/validators/url');
const authMiddleware = require('../../middlewares/auth');
const urlMiddleware = require('../../middlewares/url');

router.route('/')
	.post(validators.create, urlMiddleware.create)
	.get(authMiddleware.extractUser, urlMiddleware.list);

module.exports = router;