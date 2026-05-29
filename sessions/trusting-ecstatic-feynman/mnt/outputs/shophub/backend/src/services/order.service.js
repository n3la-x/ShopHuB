const { v4: uuidv4 } = require('uuid');
const { AppError } = require('../middleware/errorHandler');

class OrderService {
  async createOrder(userId, { cartItems, shippingAddressId, shippingMethodId, couponCode }) {
    const { Order, OrderItem, Cart, CartItem, Product, Inventory, Coupon, ShippingMethod } = require('../models');

    if (!cartItems || cartItems.length === 0) throw new AppError('Cart is empty', 400);

    let subtotal = 0;
    const items = [];
    for (const item of cartItems) {
      const product = await Product.findByPk(item.product_id);
      if (!product || !product.is_active) throw new AppError(`Product not available: ${item.product_id}`, 400);
      const inventory = await Inventory.findOne({ where: { product_id: item.product_id } });
      if (!inventory || inventory.quantity - inventory.reserved_quantity < item.quantity) {
        throw new AppError(`Insufficient stock for: ${product.name}`, 400);
      }
      const price = product.sale_price || product.price;
      subtotal += price * item.quantity;
      items.push({ product_id: item.product_id, quantity: item.quantity, unit_price: price, total_price: price * item.quantity });
    }

    const shippingMethod = await ShippingMethod.findByPk(shippingMethodId);
    const shippingAmount = shippingMethod ? shippingMethod.price : 0;

    let discountAmount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({ where: { code: couponCode, is_active: true } });
      if (coupon && (!coupon.expires_at || coupon.expires_at > new Date())) {
        discountAmount = coupon.type === 'percentage' ? subtotal * (coupon.value / 100) : coupon.value;
        await coupon.increment('used_count');
      }
    }

    const taxRate = 0.18;
    const taxAmount = (subtotal - discountAmount) * taxRate;
    const totalAmount = subtotal - discountAmount + shippingAmount + taxAmount;

    const order = await Order.create({
      user_id: userId,
      order_number: `SH-${uuidv4().slice(0, 8).toUpperCase()}`,
      subtotal, discount_amount: discountAmount, shipping_amount: shippingAmount,
      tax_amount: taxAmount, total_amount: totalAmount,
      shipping_method_id: shippingMethodId, shipping_address_id: shippingAddressId,
      created_by: userId, updated_by: userId
    });

    for (const item of items) {
      await OrderItem.create({ ...item, order_id: order.id, created_by: userId, updated_by: userId });
      await Inventory.increment({ reserved_quantity: item.quantity }, { where: { product_id: item.product_id } });
    }

    return order;
  }

  async updateStatus(orderId, status, io) {
    const { Order } = require('../models');
    const order = await Order.findByPk(orderId);
    if (!order) throw new AppError('Order not found', 404);
    await order.update({ status });

    // Real-time notification
    if (io) {
      io.to(`user_${order.user_id}`).emit('order_status_updated', { orderId, status });
    }
    return order;
  }
}

module.exports = new OrderService();
