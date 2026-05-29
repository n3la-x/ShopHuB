const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { AppError } = require('../middleware/errorHandler');
const userRepository = require('../repositories/user.repository');

class AuthService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m'
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d'
    });
    return { accessToken, refreshToken };
  }

  async register({ first_name, last_name, email, password }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new AppError('Email already in use', 409);

    const password_hash = await bcrypt.hash(password, 12);
    const user = await userRepository.create({ first_name, last_name, email, password_hash });

    // Assign default 'User' role
    await user.addRole(3); // Role ID 3 = User

    const tokens = this.generateTokens({ id: user.id, email: user.email, role: 'User' });
    await this._saveRefreshToken(user.id, tokens.refreshToken);
    return { user: { id: user.id, first_name, last_name, email }, ...tokens };
  }

  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user || !user.is_active) throw new AppError('Invalid credentials', 401);

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new AppError('Invalid credentials', 401);

    const userWithRoles = await userRepository.findWithRoles(user.id);
    const roleName = userWithRoles.roles[0]?.name || 'User';

    const tokens = this.generateTokens({ id: user.id, email: user.email, role: roleName });
    await this._saveRefreshToken(user.id, tokens.refreshToken);
    return { user: { id: user.id, first_name: user.first_name, last_name: user.last_name, email }, ...tokens };
  }

  async _saveRefreshToken(userId, token) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    // Save to RefreshTokens table
    const { RefreshToken } = require('../models');
    await RefreshToken.create({ user_id: userId, token_hash: tokenHash, expires_at: expiresAt });
  }

  async refreshToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const tokenHash = require('crypto').createHash('sha256').update(token).digest('hex');
      const { RefreshToken } = require('../models');
      const stored = await RefreshToken.findOne({ where: { token_hash: tokenHash, user_id: decoded.id, revoked_at: null } });
      if (!stored || stored.expires_at < new Date()) throw new AppError('Invalid refresh token', 401);
      const tokens = this.generateTokens({ id: decoded.id, email: decoded.email, role: decoded.role });
      await stored.update({ revoked_at: new Date() });
      await this._saveRefreshToken(decoded.id, tokens.refreshToken);
      return tokens;
    } catch {
      throw new AppError('Invalid refresh token', 401);
    }
  }
}

module.exports = new AuthService();
