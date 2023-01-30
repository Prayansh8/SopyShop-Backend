const config = {
  port: process.env.PORT || 5000,
  baseUrl: process.env.BASE_URI || "http://localhost",
  mongo: {
    url: process.env.MONGO_URL || "mongodb://localhost:27017/",
    db: process.env.MONGO_DB || "sopyshop",
  },
  jwt: {
    jwtSecretKey: process.env.JWT_SECRET_KEY || "gfg_jwt_secret_key",
    tokenHeaderKey: process.env.TOKEN_HEADER_KEY || "gfg_token_header_key",
  },
};

module.exports = { config };
