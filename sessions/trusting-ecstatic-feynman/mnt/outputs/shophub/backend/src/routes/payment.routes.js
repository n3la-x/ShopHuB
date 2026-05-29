const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');

// TODO: Implement payment routes
router.get('/', authenticate, (req, res) => res.json({ success: true, data: [], message: 'payment endpoint' }));

module.exports = router;
