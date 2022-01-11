const AWS = require('aws-sdk');

const s3Client = new AWS.S3({
  region: 'ca-central-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
  computeChecksums: true,
});

module.exports = s3Client;