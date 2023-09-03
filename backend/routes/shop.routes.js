import express from 'express'
import shopCtrl from '../controllers/shop.controller.js'
import authController from '../controllers/auth.controller.js';
import userController from '../controllers/user.controller.js';

const router = express.Router()

router.route('/shops/defaultphoto')
  .get(shopCtrl.defaultPhoto)

router.route('/shops').get(shopCtrl.list)
router.route('/shops/by/:userId').get(shopCtrl.listByOwner).post(authController.requireSignin ,authController.hasAuthorization, userController.isSeller, shopCtrl.create);
router.route('/shops/:shopId').get(shopCtrl.read).put(authController.requireSignin, shopCtrl.isOwner, shopCtrl.update).delete(authController.requireSignin, authController.hasAuthorization, shopCtrl.remove);

router.route('/shops/logo/:shopId')
  .get(shopCtrl.photo, shopCtrl.defaultPhoto)


router.param('shopId', shopCtrl.shopbyId);
router.param('userId', userController.userByID);

export default router;