const core = require("@actions/core");
const fs = require("fs");
const AWS = require("aws-sdk");

try {
  const AWS_BUCKET_NAME = core.getInput("AWS_BUCKET_NAME");
  const PATTERN = core.getInput("PATTERN");
  const DEST = core.getInput("DEST");
  const AWS_SECRET_KEY = core.getInput("AWS_SECRET_KEY");
  const AWS_SECRET_ID = core.getInput("AWS_SECRET_ID");
  const AWS_REGION = core.getInput("AWS_REGION");
  console.log(`Updating Bucket ${AWS_BUCKET_NAME} with ${PATTERN}!`);
  const s3 = new AWS.S3({
    apiVersion: "2006-03-01",
    accessKeyId: AWS_SECRET_ID,
    secretAccessKey: AWS_SECRET_KEY,
    region: AWS_REGION,
  });
  const glob = require("glob");

  const files = glob.sync(PATTERN);

  if (files.length === 0) {
    core.setOutput("uploaded", false);
    core.setFailed(`No files found for pattern ${PATTERN}`);
  }

  const params = {
    Bucket: AWS_BUCKET_NAME,
  };

  files.forEach((file) => {
    const body = fs.readFileSync(file);
    params.Body = body;
    params.Key = DEST + "/" + file.replace(/\\/g, "/");
    s3.upload(params, (err, data) => {
      if (err) {
        console.log(`Failed upload of ${file} to ${AWS_BUCKET_NAME}`);
        throw err;
      } else {
        console.log(`Succesful upload of ${file} to ${AWS_BUCKET_NAME}`);
      }
    });
    core.setOutput("uploaded", true);
  });
} catch (error) {
  core.setOutput("uploaded", false);
  core.setFailed(error.message);
}
