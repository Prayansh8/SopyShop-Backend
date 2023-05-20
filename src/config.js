const config = {
  port: process.env.PORT || 5000,
  baseUrl: process.env.BASE_URI || "http://localhost",
  mongo: {
    url:
      process.env.MONGO_URL ||
      "mongodb+srv://Prayansh811:Prayansh811@cluster0.u7jcnaf.mongodb.net/sopyshop",
  },
  jwt: {
    jwtSecretKey: process.env.JWT_SECRET_KEY || "sopyshop_jwt_secret_key",
    tokenHeaderKey: process.env.TOKEN_HEADER_KEY || "sopyshop_token_header_key",
    localStorageTokenName:
      process.env.LOCAL_STORAGE_TOKEN_NAME || "local_storage_token_name",
  },
  mailer: {
    userMail: process.env.SMPT_MAIL || "prayansh62@gmail.com",
    passwordMail: process.env.SMPT_PASSWORD || "pawbwbmawdkubqqh",
    serviceMail: process.env.SMPT_SERVICE || "gmail",
  },

  aws: {
    awsBucketName: process.env.AWS_BUCKET_NAME || "sopyshop-user-profile",
    awsAccessKey: process.env.AWS_ACCESS_KEY_ID || "AKIAXWQY27CBH7FF7N55",
    awsSecretKey:
      process.env.AWS_SECRET_ACCESS_KEY ||
      "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",
    awsReasion: process.env.AWS_REASION || "ap-south-1",
  },
};

module.exports = { config };
