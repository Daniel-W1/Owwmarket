import { Product } from "../models/product.schema.js";
import Shop from "../models/shop.schema.js";
import { User } from "../models/user.schema.js"
import dotenv from "dotenv"
dotenv.config()

const analytics = async (req, res) => {
    try {
      const { type, time } = req.params;
      const currentDate = new Date();
      let startDate = new Date();
      switch (time) {
        case 'lastyear':
          startDate.setFullYear(currentDate.getFullYear() - 1);
          break;
        case 'last6months':
          startDate.setMonth(currentDate.getMonth() - 6);
          break;
        case 'lastmonth':
          startDate.setMonth(currentDate.getMonth() - 1);
          break;
        case 'lastweek':
          startDate.setDate(currentDate.getDate() - 7);
          break;
        case 'lastday':
          startDate.setDate(currentDate.getDate() - 1);
          break;
        default:
          res.status(400).json({ success: false, error: 'Invalid time range' });
          return;
      }
        if(type === "users") {
            const users = await User.find({ createdAt: { $gte: startDate } });
            res.json({
              success: true,
              users: users
            });
        } else if(type === "shops") {
            const shops = await Shop.find({ createdAt: { $gte: startDate } });
            res.json({
              success: true,
              shops: shops
            });
        } else if(type === "products") {
            const products = await Product.find({ createdAt: { $gte: startDate } });
            res.json({
              success: true,
              products: products
            });
        } else {
           return res.status(400).json({ success: false, error: 'Invalid type of data (users-products-shops)' });
        }
    } catch (err) {
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  }
export default { analytics }