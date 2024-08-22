import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';

@Injectable()
export class AwsS3Service {
  private s3 = new S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.ACCESS_KEY_SECRET,
  });

  async uploadFile(file: Express.Multer.File) {
    const res = await this.uploadS3Bucket(
      file.buffer,
      process.env.AWS_S3_BUCKET,
      file.filename ? file.filename : file.originalname,
      file.mimetype,
    );
    return res.Location;
  }

  async uploadS3Bucket(
    file: Buffer,
    bucket: string,
    name: string,
    mimetype: string,
  ) {
    const params = {
      Bucket: bucket,
      Key: name,
      Body: file,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
    };
    return this.s3.upload(params).promise();
  }

  async deleteFile(name: string) {
    await this.deleteS3Bucket(process.env.AWS_S3_BUCKET, name);
  }

  async deleteS3Bucket(bucket: string, name: string) {
    const params = {
      Bucket: bucket,
      Key: name,
    };
    return this.s3.deleteObject(params).promise();
  }
}
