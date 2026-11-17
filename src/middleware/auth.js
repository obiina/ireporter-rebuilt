const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function authenticate(req, res, next) {
  try {
    const header = req.get('authorization') || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ error: { message: 'Authentication required.' } });
    }
    const payload = jwt.verify(token, req.app.locals.config.jwtSecret);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ error: { message: 'Invalid authentication.' } });
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ error: { message: 'Invalid or expired token.' } });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: { message: 'Administrator access required.' } });
  }
  return next();
}

module.exports = { authenticate, requireAdmin };
