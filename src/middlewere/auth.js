const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const { config } = require("../config");
const { db } = require("../databases/index");

const isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(res.status(401).send("Plese signIn to access this resources"));
  }

  const decodedDate = jwt.verify(token, config.jwt.jwtSecretKey);
  req.user = decodedDate
  next();
});

const autherizeRoles = (...roles) => {
  return (req, res, next) => {
      if (!roles.includes(req.user.user.role)) {
       return res.status(403).send(`Role: users is not allowed to access this resource `);
      }
      next();
  };
};

module.exports = { isAuthenticatedUser, autherizeRoles };
