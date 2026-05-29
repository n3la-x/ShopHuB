const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');

// TODO: Implement user routes
router.get('/', authenticate, (req, res) => res.json({ success: true, data: [], message: 'user endpoint' }));

module.exports = router;
