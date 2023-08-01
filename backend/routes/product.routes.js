import express from 'express'
import authController from '../controllers/auth.controller.js';
import productController from '../controllers/product.controller.js';

const router = express.Router()

router.route('/products').get(authController.requireSignin, authController.isAdmin, productController.list).post(authController.requireSignin, authController.hasAuthorization, productController.create);
router.route('/products/:productId').get( productController.read).put(authController.requireSignin, authController.hasAuthorization, productController.update).delete(authController.requireSignin, authController.hasAuthorization, productController.remove);
router.param('productId', productController.productByID);

export default router;