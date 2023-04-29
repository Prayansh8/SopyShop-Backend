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
  mailer: {
    userMail: process.env.SMPT_MAIL || "prayansh62@gmail.com",
    passwordMail: process.env.SMPT_PASSWORD || "pawbwbmawdkubqqh",
    serviceMail: process.env.SMPT_SERVICE || "gmail",
  },
  cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME || "df0eod1yt",
  cloudinaryKey: process.env.CLOUDINARY_API_KEY || "118137594588245",
  cloudinarySecret:
    process.env.CLOUDINARY_API_SECRET || "tGnNgJIBy-AB_avRoOY1tAY5E5o",

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
