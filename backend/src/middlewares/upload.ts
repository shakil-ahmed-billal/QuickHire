import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from '../config/cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'quickhire',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  } as any,
});

export const upload = multer({ storage });
