const { getInput, setFailed, setOutput } = require("@actions/core");
const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const { readFileSync } = require("fs");
const { sync } = require("glob");
const { basename } = require("path");

const parseInput = () => {
  const AWS_BUCKET_NAME = getInput("AWS_BUCKET_NAME");
  const PATTERN = getInput("PATTERN");
  let DEST = getInput("DEST");
  if (!DEST.endsWith("/")) {
    DEST += "/";
  }
  const AWS_SECRET_KEY = getInput("AWS_SECRET_KEY");
  const AWS_SECRET_ID = getInput("AWS_SECRET_ID");
  const AWS_REGION = getInput("AWS_REGION");

  console.log(`Updating Bucket ${AWS_BUCKET_NAME} with ${PATTERN}!`);
  const s3 = new S3Client({
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_SECRET_ID,
      secretAccessKey: AWS_SECRET_KEY,
    },
  });

  const files = sync(PATTERN);

  if (files.length === 0) {
    throw new Error(`No files found matching ${PATTERN}`);
  }
  return { files, s3, DEST, AWS_BUCKET_NAME };
};

const uploadFiles = async (files, s3, DEST, AWS_BUCKET_NAME) => {
  files.forEach((file) => {
    const body = readFileSync(file);
    const fileName = basename(file);
    const params = {
      Bucket: AWS_BUCKET_NAME,
      Key: DEST + fileName,
      Body: body,
    };
    s3.send(new PutObjectCommand(params))
      .then(() => {
        console.log(`Successful upload of ${file} to ${AWS_BUCKET_NAME}`);
        setOutput("uploaded", true);
      })
      .catch((err) => {
        console.log(`Failed upload of ${file} to ${AWS_BUCKET_NAME}`);
        throw err;
      });
  });
};

try {
  const { files, s3, DEST, AWS_BUCKET_NAME } = parseInput();
  uploadFiles(files, s3, DEST, AWS_BUCKET_NAME);
} catch (error) {
  setOutput("uploaded", false);
  setFailed(error.message);
}
