/* eslint-disable @typescript-eslint/no-var-requires */
import { PrismaClient } from '@prisma/client';
import { S3 } from 'aws-sdk';
import { seedData } from './data';

const cuid = require('cuid');
const prisma = new PrismaClient();
const s3 = new S3({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.ACCESS_KEY_SECRET,
});

function convertLink(shareUrl: string): string {
  const fileIdMatch = shareUrl.match(/\/d\/([a-zA-Z0-9_-]+)\//);

  if (fileIdMatch && fileIdMatch[1]) {
    const fileId = fileIdMatch[1];
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  } else {
    throw new Error('Invalid Google Drive sharing URL');
  }
}

async function uploadFile(
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
  const res = await s3.upload(params).promise();
  return res.Location;
}

async function downloadFile(url: string, retries = 3): Promise<Buffer> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    const response = await fetch(convertLink(url), {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Failed to fetch file url: ${response.statusText}`);
    }
    return Buffer.from(await response.arrayBuffer());
  } catch (error) {
    if (retries > 0) {
      console.log(`Retrying... (${3 - retries + 1})`);
      return downloadFile(url, retries - 1);
    } else {
      throw new Error(
        `Failed to fetch file after multiple attempts: ${error.message}`,
      );
    }
  }
}

async function uploadFiles(
  id: string,
  video: string,
  coverImage: string,
): Promise<{ videoUrl: string; coverImageUrl: string }> {
  const videoBuffer = await downloadFile(video);
  const coverImageBuffer = await downloadFile(coverImage);

  const videoUrl = await uploadFile(
    videoBuffer,
    process.env.AWS_S3_BUCKET,
    id + '_video',
    'image/mp4',
  );
  const coverImageUrl = await uploadFile(
    coverImageBuffer,
    process.env.AWS_S3_BUCKET,
    id + '_cover_image',
    'image/jpeg',
  );

  return { videoUrl, coverImageUrl };
}

async function seedDatabase() {
  try {
    for (const data of seedData) {
      console.log(`Processing ${data.title}...`);

      const film = await prisma.film.findUnique({
        where: {
          title_director_release_year: {
            title: data.title,
            director: data.director,
            release_year: data.release_year,
          },
        },
      });

      if (film) {
        console.log('Already processed before');
        continue;
      }

      const id = cuid();
      const { videoUrl, coverImageUrl } = await uploadFiles(
        id,
        data.video_url,
        data.cover_image_url,
      );
      await prisma.film.create({
        data: {
          id: id,
          title: data.title,
          description: data.description,
          director: data.director,
          release_year: data.release_year,
          genre: data.genre,
          price: data.price,
          duration: data.duration,
          video_url: videoUrl,
          cover_image_url: coverImageUrl,
        },
      });
      console.log(`Finish!`);
    }
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
