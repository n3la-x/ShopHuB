const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');

// TODO: Implement cart routes
router.get('/', authenticate, (req, res) => res.json({ success: true, data: [], message: 'cart endpoint' }));

module.exports = router;
