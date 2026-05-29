const orderService = require('../services/order.service');

class OrderController {
  async create(req, res, next) {
    try {
      const order = await orderService.createOrder(req.user.id, req.body);
      res.status(201).json({ success: true, data: order });
    } catch (err) { next(err); }
  }

  async getMyOrders(req, res, next) {
    try {
      const { Order, OrderItem } = require('../models');
      const orders = await Order.findAll({
        where: { user_id: req.user.id },
        include: [{ model: OrderItem, as: 'items' }],
        order: [['created_at', 'DESC']]
      });
      res.json({ success: true, data: orders });
    } catch (err) { next(err); }
  }

  async updateStatus(req, res, next) {
    try {
      const io = req.app.get('io');
      const order = await orderService.updateStatus(req.params.id, req.body.status, io);
      res.json({ success: true, data: order });
    } catch (err) { next(err); }
  }
}

module.exports = new OrderController();
