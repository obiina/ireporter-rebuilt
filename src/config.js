const required = ['MONGODB_URI', 'JWT_SECRET'];

function loadConfig() {
  for (const key of required) {
    if (!process.env[key]) throw new Error(`Missing required environment variable: ${key}`);
  }
  if (process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must contain at least 32 characters.');
  }
  return {
    port: Number(process.env.PORT || 3000),
    mongoUri: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
    bcryptRounds: Number(process.env.BCRYPT_ROUNDS || 12)
  };
}

module.exports = { loadConfig };
