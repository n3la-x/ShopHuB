const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');

// TODO: Implement admin routes
router.get('/', authenticate, (req, res) => res.json({ success: true, data: [], message: 'admin endpoint' }));

module.exports = router;
