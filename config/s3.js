const AWS = require("aws-sdk");
AWS.config.credentials = {
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_KEY,
};

const s3Client = new AWS.S3({
	region: "ca-central-1",
	computeChecksums: true,
});

var params = {
	Bucket: process.env.BUCKET_NAME
};

s3Client.headBucket(params, function(err, data) {
	if (err) { 
		console.log("s3 Client Error", err.stack); // an error occurred
		process.exit(1);
	}
	else if (Object.keys(data).length === 0 && data.constructor === Object) {
		var params = {Bucket: process.env.BUCKET_NAME, Key: "key", Body: "body"};
		var delParams = {Bucket: process.env.BUCKET_NAME, Key: "key"};
		s3Client.upload(params, function(err, data) {
			if (err) { 
				console.log("s3 Client Uploading Error", err); // an error occurred
				process.exit(1);
			}
			else {
				s3Client.deleteObject(delParams, function(err) {
					if (err) { 
						console.log("s3 Client Deleting Error", err); // an error occurred
						process.exit(1);
					}
					console.log("S3 Bucket Upload and Download Functioning");
				});
			}
		});
	}
	else {
		console.log("s3 Client", data);
		process.exit(1);
	}
});

module.exports = s3Client;