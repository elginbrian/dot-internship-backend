import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileStorageService {
  private uploadDir: string;

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get<string>('storage.uploadDir') || './uploads';
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const dir = path.join(this.uploadDir, String(year), month);

    await fs.mkdir(dir, { recursive: true });

    const filename = `${uuidv4()}${path.extname(file.originalname)}`;
    const filepath = path.join(dir, filename);

    if (file.mimetype.startsWith('image/')) {
      await sharp(file.buffer)
        .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toFile(filepath);
    } else {
      await fs.writeFile(filepath, file.buffer);
    }

    return path.relative(this.uploadDir, filepath).replace(/\\/g, '/');
  }

  async deleteFile(filename: string): Promise<void> {
    const filepath = path.join(this.uploadDir, filename);
    try {
      await fs.unlink(filepath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }

  getFilePath(filename: string): string {
    return path.join(this.uploadDir, filename);
  }

  getFileUrl(filename: string | undefined): string | undefined {
    if (!filename) return undefined;
    const baseUrl = this.configService.get<string>('app.baseUrl') || 'http://localhost:3000';
    return `${baseUrl}/uploads/${filename}`;
  }

  async fileExists(filename: string): Promise<boolean> {
    try {
      await fs.access(path.join(this.uploadDir, filename));
      return true;
    } catch {
      return false;
    }
  }
}
