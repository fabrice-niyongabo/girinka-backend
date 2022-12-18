const protectRoutes = (allowedRoles) => {
  return (req, res, next) => {
    if (allowedRoles) {
      if (allowedRoles.includes(req.user.role)) {
        return next();
      } else {
        return res.status(400).send({
          msg: "You dont have access to this information, Contact admin for further info",
          error: true,
        });
      }
    } else {
      return next();
    }
  };
};

module.exports = protectRoutes;
