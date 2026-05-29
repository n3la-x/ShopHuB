const router = require('express').Router();
const orderController = require('../controllers/order.controller');
const { authenticate, authorize } = require('../middleware/auth');

router.post('/', authenticate, orderController.create);
router.get('/my', authenticate, orderController.getMyOrders);
router.patch('/:id/status', authenticate, authorize('Admin', 'Manager'), orderController.updateStatus);

module.exports = router;
