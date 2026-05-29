const productService = require('../services/product.service');

class ProductController {
  async getAll(req, res, next) {
    try {
      const data = await productService.getAll(req.query);
      res.json({ success: true, data });
    } catch (err) { next(err); }
  }

  async getById(req, res, next) {
    try {
      const product = await productService.getById(req.params.id);
      res.json({ success: true, data: product });
    } catch (err) { next(err); }
  }

  async create(req, res, next) {
    try {
      const product = await productService.create(req.body, req.user.id);
      res.status(201).json({ success: true, data: product });
    } catch (err) { next(err); }
  }

  async update(req, res, next) {
    try {
      const product = await productService.update(req.params.id, req.body, req.user.id);
      res.json({ success: true, data: product });
    } catch (err) { next(err); }
  }

  async delete(req, res, next) {
    try {
      await productService.delete(req.params.id);
      res.json({ success: true, message: 'Product deleted' });
    } catch (err) { next(err); }
  }
}

module.exports = new ProductController();
