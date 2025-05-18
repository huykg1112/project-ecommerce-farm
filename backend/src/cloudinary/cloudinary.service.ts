import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {
    // Cloudinary đã được cấu hình trong CloudinaryModule
  }

  async uploadImage(file: Express.Multer.File): Promise<{ url: string; public_id: string }> {
    try {
      if (!file) {
        throw new Error('No file provided');
      }

      if (!file.buffer) {
        throw new Error('File buffer is missing');
      }

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: 'ecommerce-farm',
            transformation: [
              { 
                width: 1000, 
                height: 1000, 
                crop: 'limit',
                quality: 'auto'
              }
            ],
          },
          (error: UploadApiErrorResponse, result: UploadApiResponse) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(new Error(error.message || 'Failed to upload to cloud storage'));
            } else if (!result || !result.secure_url || !result.public_id) {
              reject(new Error('Invalid upload result from cloud storage'));
            } else {
              resolve({
                url: result.secure_url,
                public_id: result.public_id,
              });
            }
          },
        );

        uploadStream.end(file.buffer);
      });
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(error.message || 'Failed to upload image');
    }
  }

  async deleteImage(public_id: string): Promise<boolean> {
    try {
      await cloudinary.uploader.destroy(public_id);
      return true;
    } catch (error) {
      throw new Error('Delete failed: ' + error.message);
    }
  }

  async updateImage(public_id: string, file: Express.Multer.File): Promise<{ url: string; public_id: string }> {
    try {
      // Xóa ảnh cũ
      await this.deleteImage(public_id);
      // Upload ảnh mới
      return await this.uploadImage(file);
    } catch (error) {
      throw new Error('Update failed: ' + error.message);
    }
  }
}