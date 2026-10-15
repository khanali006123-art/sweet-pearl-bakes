import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  getProducts,
  getProductBySlug,
  adminGetAllProducts,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct
} from '../controllers/productController';
import {
  createOrder,
  trackOrder,
  adminGetOrders,
  adminGetOrderById,
  adminUpdateOrderStatus,
  adminUpdateOrderPayment,
  adminExportOrdersCsv
} from '../controllers/orderController';
import { login, logout, getMe } from '../controllers/authController';
import { createMessage, adminGetMessages, adminUpdateMessageStatus } from '../controllers/messageController';
import { subscribe, adminGetSubscribers } from '../controllers/subscriberController';
import { getPublicSettings, adminUpdateSettings, adminGetStats } from '../controllers/settingsController';
import { uploadImage } from '../controllers/uploadController';
import { requireAdmin } from '../middleware/authMiddleware';

const router = Router();

// Multer storage configuration
const uploadsDir = path.resolve(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `file_${Date.now()}_${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
    }
  }
});

// --- Public Routes ---
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Sweet Pearl Bakes API',
    version: '1.0.0',
    timestamp: new Date()
  });
});

// Catalog
router.get('/products', getProducts);
router.get('/products/:slug', getProductBySlug);

// Orders & Tracking
router.post('/orders', createOrder);
router.post('/orders/track', trackOrder);

// Uploads
router.post('/uploads/proof', upload.single('file'), uploadImage);
router.post('/uploads/design', upload.single('file'), uploadImage);

// Feedback & Newsletter
router.post('/messages', createMessage);
router.post('/subscribers', subscribe);

// Settings
router.get('/settings/public', getPublicSettings);

// Authentication
router.post('/auth/login', login);
router.post('/auth/logout', logout);
router.get('/auth/me', requireAdmin, getMe);

// --- Admin Protected Routes ---
router.get('/admin/stats', requireAdmin, adminGetStats);
router.get('/admin/orders', requireAdmin, adminGetOrders);
router.get('/admin/orders/:id', requireAdmin, adminGetOrderById);
router.patch('/admin/orders/:id/status', requireAdmin, adminUpdateOrderStatus);
router.patch('/admin/orders/:id/payment', requireAdmin, adminUpdateOrderPayment);
router.get('/admin/export/orders.csv', requireAdmin, adminExportOrdersCsv);

router.get('/admin/products', requireAdmin, adminGetAllProducts);
router.post('/admin/products', requireAdmin, adminCreateProduct);
router.patch('/admin/products/:id', requireAdmin, adminUpdateProduct);
router.delete('/admin/products/:id', requireAdmin, adminDeleteProduct);

router.get('/admin/messages', requireAdmin, adminGetMessages);
router.patch('/admin/messages/:id', requireAdmin, adminUpdateMessageStatus);

router.get('/admin/subscribers', requireAdmin, adminGetSubscribers);
router.patch('/admin/settings', requireAdmin, adminUpdateSettings);

export default router;
