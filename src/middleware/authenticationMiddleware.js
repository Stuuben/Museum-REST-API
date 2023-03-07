const { UnauthenticatedError, UnauthorizedError } = require("../utils/error");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      // @ts-ignore
      userId: payload.userId,
      // @ts-ignore
      role: payload.role,
      // @ts-ignore
      username: payload.username,
    };

    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user?.role || !roles.includes(req.user.role)) {
      console.log(req.user.role, roles);
      throw new UnauthorizedError("Unauthorized Access");
    }
    next();
  };
};
