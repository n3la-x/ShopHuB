const BaseRepository = require('./base.repository');
const { Op } = require('sequelize');

class ProductRepository extends BaseRepository {
  constructor() { super(null); }
  setModel(model) { this.model = model; }

  async searchProducts({ search, categoryId, brandId, minPrice, maxPrice, sortBy, sortOrder, page, limit }) {
    const where = { is_active: true };
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    if (categoryId) where.category_id = categoryId;
    if (brandId) where.brand_id = brandId;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }
    const order = [[sortBy || 'created_at', sortOrder || 'DESC']];
    const offset = (page - 1) * limit;
    return this.model.findAndCountAll({ where, order, limit, offset, include: ['category', 'brand', 'images'] });
  }
}

module.exports = new ProductRepository();
