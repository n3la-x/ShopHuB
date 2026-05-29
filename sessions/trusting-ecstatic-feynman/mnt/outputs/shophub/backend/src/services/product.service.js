const { AppError } = require('../middleware/errorHandler');
const productRepository = require('../repositories/product.repository');

class ProductService {
  async getAll(query) {
    const { search, categoryId, brandId, minPrice, maxPrice, sortBy, sortOrder, page = 1, limit = 12 } = query;
    const result = await productRepository.searchProducts({
      search, categoryId, brandId, minPrice, maxPrice, sortBy, sortOrder,
      page: parseInt(page), limit: parseInt(limit)
    });
    return {
      products: result.rows,
      total: result.count,
      page: parseInt(page),
      totalPages: Math.ceil(result.count / limit)
    };
  }

  async getById(id) {
    const product = await productRepository.findById(id, {
      include: ['category', 'brand', 'images', 'tags', 'inventory']
    });
    if (!product) throw new AppError('Product not found', 404);
    return product;
  }

  async create(data, userId) {
    const slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
    return productRepository.create({ ...data, slug, created_by: userId, updated_by: userId });
  }

  async update(id, data, userId) {
    const product = await productRepository.findById(id);
    if (!product) throw new AppError('Product not found', 404);
    return productRepository.update(id, { ...data, updated_by: userId });
  }

  async delete(id) {
    const product = await productRepository.findById(id);
    if (!product) throw new AppError('Product not found', 404);
    return productRepository.delete(id);
  }
}

module.exports = new ProductService();
