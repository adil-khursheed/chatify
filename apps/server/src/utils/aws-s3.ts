import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3BucketRegion = process.env.S3_BUCKET_REGION || "";
const s3BucketName = process.env.S3_BUCKET_NAME || "";
const s3AccessKey = process.env.AWS_ACCESS_KEY || "";
const s3SecretKey = process.env.AWS_SECRET_KEY || "";

const s3Client = new S3Client({
  region: s3BucketRegion,
  credentials: {
    accessKeyId: s3AccessKey,
    secretAccessKey: s3SecretKey,
  },
});

export async function getObjectURL(fileKey: string) {
  const command = new GetObjectCommand({
    Bucket: s3BucketName,
    Key: fileKey,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  return url;
}

export async function uploadObjectURL(
  contentType: string,
  fileKey: string,
  buffer: Express.Multer.File["buffer"]
) {
  const command = new PutObjectCommand({
    Bucket: s3BucketName,
    Key: fileKey,
    Body: buffer,
    ContentType: contentType,
  });

  await s3Client.send(command);
}
