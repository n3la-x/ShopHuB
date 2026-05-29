const authService = require('../services/auth.service');

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) { next(err); }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      res.json({ success: true, data: result });
    } catch (err) { next(err); }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const tokens = await authService.refreshToken(refreshToken);
      res.json({ success: true, data: tokens });
    } catch (err) { next(err); }
  }

  async logout(req, res, next) {
    try {
      // Revoke token logic here
      res.json({ success: true, message: 'Logged out successfully' });
    } catch (err) { next(err); }
  }

  async me(req, res, next) {
    try {
      const userRepository = require('../repositories/user.repository');
      const user = await userRepository.findWithRoles(req.user.id);
      res.json({ success: true, data: user });
    } catch (err) { next(err); }
  }
}

module.exports = new AuthController();
