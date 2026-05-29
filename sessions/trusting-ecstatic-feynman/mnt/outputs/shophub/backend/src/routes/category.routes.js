const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');

// TODO: Implement category routes
router.get('/', authenticate, (req, res) => res.json({ success: true, data: [], message: 'category endpoint' }));

module.exports = router;
