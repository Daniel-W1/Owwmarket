import express from 'express'
import authController from '../controllers/auth.controller.js';
import productController from '../controllers/product.controller.js';
import shopController from '../controllers/shop.controller.js';

const router = express.Router()

router.get('/products', productController.list);
router.route('/from/:shopId/products').get(authController.requireSignin, productController.list).post(authController.requireSignin, authController.hasAuthorization, productController.create);
router.route('/products/:productId/images').get(productController.photo, productController.defaultPhoto);
router.route('/from/:shopId/products/:productId').get( productController.read).put(authController.requireSignin, authController.hasAuthorization, productController.update).delete(authController.requireSignin, authController.hasAuthorization, productController.remove);
router.param('productId', productController.productByID);
router.param('shopId', shopController.shopbyId);

export default router;