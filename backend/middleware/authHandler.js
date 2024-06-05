const jwt = require('jsonwebtoken');

const { getRedisKey } = require('../utils/redis');

async function authHandler(req, res, next) {
  const auth = req?.headers?.authorization;

  if (!auth?.startsWith('Bearer ') || auth.slice(7) === 'undefined') return next();

  try {
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getRedisKey(decoded.name);

    if (!user || user?.timestamp !== decoded?.timestamp) return res.sendStatus(401);

    req.user = user;
    return next();
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
}

module.exports = authHandler;
