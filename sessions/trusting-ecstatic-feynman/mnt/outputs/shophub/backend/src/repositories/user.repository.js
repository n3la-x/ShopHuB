const BaseRepository = require('./base.repository');
const { sequelize } = require('../config/database');

class UserRepository extends BaseRepository {
  constructor() {
    // Model will be injected after models are initialized
    super(null);
  }

  setModel(model) { this.model = model; }

  async findByEmail(email) {
    return this.model.findOne({ where: { email } });
  }

  async findWithRoles(id) {
    return this.model.findByPk(id, {
      include: [{ association: 'roles', through: { attributes: [] } }],
      attributes: { exclude: ['password_hash'] }
    });
  }
}

module.exports = new UserRepository();
