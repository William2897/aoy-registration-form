// backend/src/middleware/upload.ts

import multer from 'multer';

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and PDFs are allowed.'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});