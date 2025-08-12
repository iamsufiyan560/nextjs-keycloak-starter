export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({ error: "Access denied: No roles found" });
    }

    const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({
        error: "Access denied: Insufficient permissions",
        requiredRoles: allowedRoles,
        userRoles: req.user.roles,
      });
    }

    next();
  };
};
