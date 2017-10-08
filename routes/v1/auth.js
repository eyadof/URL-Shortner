const {Router} = require('express');
const router = Router();
const validators = require('../../middlewares/validators/auth');
const authMiddleware = require('../../middlewares/auth');


router.post('/signup', validators.signup, authMiddleware.signup);
router.post('/signup/anonymous', authMiddleware.registerAnonymous);
router.post('/login', validators.login, authMiddleware.login);

module.exports = router;