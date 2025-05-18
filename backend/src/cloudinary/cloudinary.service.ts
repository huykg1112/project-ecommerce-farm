import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

@Injectable()
export class CloudinaryService {
  private storage: CloudinaryStorage;
  private upload: multer.Multer;

  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });

    this.storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: async (req, file) => ({
        folder: 'ecommerce-farm',
        format: 'png,jpg,jpeg', // or derive from file.mimetype
        transformation: [{ width: 1000, height: 1000, crop: 'limit', fetch_format: 'auto', quality: 'auto' }]
      }),
    });

    this.upload = multer({ storage: this.storage });
  }

  getUploadMiddleware() {
    return this.upload.single('image');
  }

  async uploadImage(file: Express.Multer.File) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'ecommerce-farm',
      });
      return {
        url: result.secure_url,
        public_id: result.public_id,
      };
    } catch (error) {
      throw new Error('Upload failed: ' + error.message);
    }
  }

  async deleteImage(public_id: string) {
    try {
      await cloudinary.uploader.destroy(public_id);
      return true;
    } catch (error) {
      throw new Error('Delete failed: ' + error.message);
    }
  }

  async updateImage(public_id: string, file: Express.Multer.File) {
    try {
      // Delete old image
      await this.deleteImage(public_id);
      // Upload new image
      const result = await this.uploadImage(file);
      return result;
    } catch (error) {
      throw new Error('Update failed: ' + error.message);
    }
  }
} 