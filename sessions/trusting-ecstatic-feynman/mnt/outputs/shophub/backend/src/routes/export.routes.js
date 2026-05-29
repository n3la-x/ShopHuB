const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');

// TODO: Implement export routes
router.get('/', authenticate, (req, res) => res.json({ success: true, data: [], message: 'export endpoint' }));

module.exports = router;
