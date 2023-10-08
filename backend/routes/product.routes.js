import express from 'express'
import authController from '../controllers/auth.controller.js';
import productController from '../controllers/product.controller.js';
import shopController from '../controllers/shop.controller.js';
import userController from '../controllers/user.controller.js';

const router = express.Router()

router.get('/products', productController.list);
router.get('/feed', authController.requireSignin, productController.paginationMiddleware, productController.GetFeedForUser);
router.route('/by/:userId/from/:shopId/products').get(productController.listByShop).post(authController.requireSignin, authController.hasAuthorization, productController.create);
router.route('/products/:productId/images').get(productController.photo, productController.defaultPhoto);
router.route('/from/:shopId/products/:productId').get( productController.read).put(authController.requireSignin, authController.hasAuthorization, productController.update).delete(authController.requireSignin, authController.hasAuthorization, productController.remove);
router.route('/products/:productId/bids').get(productController.bids).put(authController.requireSignin, productController.setBids)
router.param('productId', productController.productByID);
router.param('shopId', shopController.shopbyId);
router.param('userId', userController.userByID);

export default router;