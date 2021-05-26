const { clearHash } = require('../services/cache');

module.exports = async (req, res, next) => {
  await next(); // execution comes back after route handler
  console.log('Clear Hash Being Called: ', req.user.id);
  clearHash(req.user.id);
}