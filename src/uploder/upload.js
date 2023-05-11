const AWS = require("aws-sdk");
const multer = require("multer");
const { config } = require("../config");

const s3 = new AWS.S3({
  accessKeyId: config.aws.awsAccessKey,
  secretAccessKey: config.aws.awsSecretKey,
  region: config.aws.awsReasion,
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/gif" ||
    file.mimetype === "image/webp" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jfif"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file type"), false);
  }
};
// Configure multer for file uploads
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 8, // 8MB
  },
  fileFilter: fileFilter,
});

const uploadImage = (file) => {
  const params = {
    Bucket: config.aws.awsBucketName,
    Key: new Date().toISOString() + file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
  };
  return s3.upload(params).promise();
};

module.exports = { upload, uploadImage, s3 };
