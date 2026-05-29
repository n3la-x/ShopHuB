class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll(options = {}) {
    return this.model.findAll(options);
  }

  async findById(id, options = {}) {
    return this.model.findByPk(id, options);
  }

  async findOne(options = {}) {
    return this.model.findOne(options);
  }

  async create(data) {
    return this.model.create(data);
  }

  async update(id, data) {
    const [affected] = await this.model.update(data, { where: { id } });
    return affected > 0;
  }

  async delete(id) {
    return this.model.destroy({ where: { id } });
  }

  async findAndCount(options = {}) {
    return this.model.findAndCountAll(options);
  }
}

module.exports = BaseRepository;
