const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');

// TODO: Implement notification routes
router.get('/', authenticate, (req, res) => res.json({ success: true, data: [], message: 'notification endpoint' }));

module.exports = router;
