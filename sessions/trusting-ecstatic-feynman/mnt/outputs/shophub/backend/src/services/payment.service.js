const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { AppError } = require('../middleware/errorHandler');

class PaymentService {
  async createPaymentIntent(orderId, amount, currency = 'eur') {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // cents
      currency,
      metadata: { orderId: String(orderId) }
    });
    const { Payment } = require('../models');
    await Payment.create({
      order_id: orderId,
      stripe_payment_intent_id: paymentIntent.id,
      method: 'stripe',
      status: 'pending',
      amount,
      currency: currency.toUpperCase()
    });
    return { clientSecret: paymentIntent.client_secret };
  }

  async handleWebhook(payload, signature) {
    let event;
    try {
      event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch {
      throw new AppError('Invalid webhook signature', 400);
    }
    const { Payment, Order } = require('../models');
    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object;
      await Payment.update({ status: 'succeeded', stripe_charge_id: pi.latest_charge }, { where: { stripe_payment_intent_id: pi.id } });
      await Order.update({ status: 'confirmed' }, { where: { id: pi.metadata.orderId } });
    }
    if (event.type === 'payment_intent.payment_failed') {
      const pi = event.data.object;
      await Payment.update({ status: 'failed' }, { where: { stripe_payment_intent_id: pi.id } });
    }
    return { received: true };
  }
}

module.exports = new PaymentService();
