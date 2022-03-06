const AWS = require('aws-sdk');
AWS.config.credentials = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_KEY,
};

//verify credentials
AWS.config.getCredentials(function(err) {
  if (err) console.log(err.stack);
});

const s3Client = new AWS.S3({
  region: 'ca-central-1',
  computeChecksums: true,
});


module.exports = s3Client;