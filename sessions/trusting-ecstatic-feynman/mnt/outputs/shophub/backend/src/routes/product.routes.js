const router = require('express').Router();
const productController = require('../controllers/product.controller');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @swagger
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: Get all products with filters
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: categoryId
 *         schema: { type: integer }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 12 }
 */
router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.post('/', authenticate, authorize('Admin', 'Manager'), productController.create);
router.put('/:id', authenticate, authorize('Admin', 'Manager'), productController.update);
router.delete('/:id', authenticate, authorize('Admin'), productController.delete);

module.exports = router;
