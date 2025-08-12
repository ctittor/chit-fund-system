function requireSuperAdmin(req, res, next) {
  if (req.user && req.user.role === 'SUPER_ADMIN') {
    return next();
  }
  return res.status(403).json({ error: 'Forbidden: Super Admins only' });
}

module.exports = requireSuperAdmin;
