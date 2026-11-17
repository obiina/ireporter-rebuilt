const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const { registerSchema, loginSchema } = require('../validation/schemas');

const router = express.Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false });

router.post('/register', authLimiter, async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const email = data.email.toLowerCase();
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: { message: 'An account with that email already exists.' } });
    const passwordHash = await bcrypt.hash(data.password, req.app.locals.config.bcryptRounds);
    const user = await User.create({ name: data.name, email, passwordHash });
    return res.status(201).json({ data: { user: publicUser(user) } });
  } catch (error) { return next(error); }
});

router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const user = await User.findOne({ email: data.email.toLowerCase() }).select('+passwordHash');
    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
      return res.status(401).json({ error: { message: 'Email or password is incorrect.' } });
    }
    const token = jwt.sign({ sub: user.id }, req.app.locals.config.jwtSecret, {
      expiresIn: req.app.locals.config.jwtExpiresIn
    });
    return res.json({ data: { token, user: publicUser(user) } });
  } catch (error) { return next(error); }
});

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

module.exports = router;
