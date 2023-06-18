const core = require("@actions/core");
const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const glob = require("glob");

try {
  const AWS_BUCKET_NAME = core.getInput("AWS_BUCKET_NAME");
  const PATTERN = core.getInput("PATTERN");
  let DEST = core.getInput("DEST");
  if (!DEST.endsWith("/")) {
    DEST += "/";
  }
  const AWS_SECRET_KEY = core.getInput("AWS_SECRET_KEY");
  const AWS_SECRET_ID = core.getInput("AWS_SECRET_ID");
  const AWS_REGION = core.getInput("AWS_REGION");
  console.log(`Updating Bucket ${AWS_BUCKET_NAME} with ${PATTERN}!`);
  const s3 = new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_SECRET_ID,
      secretAccessKey: AWS_SECRET_KEY,
    },
  });

  const files = glob.sync(PATTERN);

  if (files.length === 0) {
    throw new Error(`No files found matching ${PATTERN}`);
  }

  files.forEach((file) => {
    const body = fs.readFileSync(file);
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: DEST + file.replace(/\\/g, "/"),
      Body: body,
    };
    s3.send(new PutObjectCommand(params))
      .then(() => {
        console.log(`Successful upload of ${file} to ${AWS_BUCKET_NAME}`);
        core.setOutput("uploaded", true);
      })
      .catch((err) => {
        console.log(`Failed upload of ${file} to ${AWS_BUCKET_NAME}`);
        throw err;
      });
  });
} catch (error) {
 core.setFailed(error.message);
}
