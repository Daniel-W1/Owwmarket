import express from 'express'
import authController from '../controllers/auth.controller.js';
import productController from '../controllers/product.controller.js';
import shopController from '../controllers/shop.controller.js';
import adminController from '../controllers/admin.controller.js';

const router = express.Router()

router.get('/analytics/:type/:time', adminController.analytics)

export default router;