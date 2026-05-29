const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');

// TODO: Implement review routes
router.get('/', authenticate, (req, res) => res.json({ success: true, data: [], message: 'review endpoint' }));

module.exports = router;
