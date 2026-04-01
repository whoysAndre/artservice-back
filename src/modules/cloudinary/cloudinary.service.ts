import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { envs } from 'src/config';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: envs.cloudinaryCloudName,
      api_key: envs.cloudinaryApiKey,
      api_secret: envs.cloudinaryApiSecret,
    });
  }

  uploadFromBuffer(buffer: Buffer, folder: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) return reject(error);
          resolve(result!.secure_url);
        },
      );
      streamifier.createReadStream(buffer).pipe(stream);
    });
  }
}
