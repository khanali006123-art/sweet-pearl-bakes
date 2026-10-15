import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export async function uploadImage(req: Request, res: Response, next: NextFunction) {
  try {
    // Check if multipart file exists from multer or json base64 data
    if (req.file) {
      const relativeUrl = `/uploads/${req.file.filename}`;
      res.json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          url: relativeUrl,
          filename: req.file.filename
        }
      });
      return;
    }

    // Support json payload { dataUrl: "data:image/jpeg;base64,..." }
    const { dataUrl, filenamePrefix } = req.body;
    if (dataUrl && typeof dataUrl === 'string' && dataUrl.startsWith('data:image/')) {
      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const ext = matches[1].split('/')[1] || 'jpg';
        const buffer = Buffer.from(matches[2], 'base64');
        const filename = `${filenamePrefix || 'upload'}_${Date.now()}.${ext}`;
        const filePath = path.join(UPLOADS_DIR, filename);
        fs.writeFileSync(filePath, buffer);

        res.json({
          success: true,
          message: 'Image uploaded successfully',
          data: {
            url: `/uploads/${filename}`,
            filename
          }
        });
        return;
      }
    }

    res.status(400).json({ success: false, message: 'No valid image provided. Please provide an image file (JPEG, PNG, WebP) under 5MB.' });
  } catch (err) {
    next(err);
  }
}
