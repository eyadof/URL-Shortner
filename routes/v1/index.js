const {Router} = require('express');
const router = Router();
const authMiddleware = require('../../middlewares/auth');
const authRoutes = require('./auth');
const urlsRoutes = require('./urls');

router.use('/auth', authRoutes);
router.use('/urls', authMiddleware.extractUser, urlsRoutes);

module.exports = router;