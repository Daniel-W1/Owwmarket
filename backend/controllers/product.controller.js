import { User, GoogleUser } from '../models/user.schema.js'
import _ from 'lodash'
import errorHandler from '../helpers/dbhelper.js';
import {Product, ProductAuction} from '../models/product.schema.js';
import Log from "../models/log.schema.js";
import slugify from "slugify";
import formidable from 'formidable';
import fs from 'fs';
import { myCache } from '../index.js';

const defaultImage = '/public/files/default.png'

const productByID = async (req, res, next, id) => { 
    try {
        const product = await Product.findById(id);
        if (!product)
            return res.status(400).json({
                success: false,
                error: "Product not found"
            })
        req.originalproduct = { ...product };
        req.product = product;
        next()
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: "Could not retrieve product"
        })
    }
 }

 const read = async (req, res) => {
    return res.json(req.product)
}

const create = async (req, res) => {
    let form = formidable();
    form.keepExtensions = true
    form.maxFileSize = 100 * 1024 * 1024;
    const shopid = req.shop._id;
    const userId = req.auth._id;
    
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                success: false,
                error: "Images could not be uploaded"
            })
        }
        
        let { productname, productdescription, category, price, auction, startedprice, location, itemsLeft, intialItemCount } = fields;
        
        
        let productExists = await Product.findOne({ "shopId": shopid,"productname": productname.join(' ') })
        if (productExists)
        return res.status(403).json({
            success: false,
            error: "This product name already in the shop!"
        })

        let slug;
        // console.log(auction === ['true'], 'auction');
        auction = auction.join('').includes('true') ? true : false;
        if(productname) {
            slug = slugify(productname.join(' '), {
                lower: true,
                strict: true,
              });
        }

        let product;
        if(auction) {
             product = new ProductAuction({
                owner: userId,
                shopId: shopid,
                productname: productname.join(' '),
                productdescription: productdescription.join(' '),
                category: category ? category.join(' ') : null,
                startedprice: startedprice ? +startedprice.join(' ') : 0,
                slug,
                auction: true,
                location: location.join(' '),
                intialItemCount: +intialItemCount.join(' '),
                itemsLeft: +itemsLeft.join(' ')
              });
        } else {
            console.log(intialItemCount.join(' '));

             product = new Product({
                owner: userId,
                shopId: shopid,
                productname: productname.join(' '),
                productdescription: productdescription.join(' '),
                category: category ? category.join(' ') : null,
                price: +price.join(' ') ,
                slug,
                location: location.join(' '),
                intialItemCount: +intialItemCount.join(' '),
                itemsLeft: +itemsLeft.join(' ')
            })     
        }

        // process images
        if(files.productImages) {
            let arrayOfImages = [];
            files.productImages.forEach(image => {
                arrayOfImages.push({
                    data: fs.readFileSync(image.filepath),
                    contentType: image.mimetype
                })
            })
            product.productImages = arrayOfImages;
        }

        try {
            await product.save()
             res.status(200).json({
                success: true,
                product: product,
            })
            // logs
           
            const log = new Log({
                user: req.auth._id,
                resource: "product",
                resourceid: product._id,
                action: "productcreate",
                description: `${product.productname} was created`,
                details: product,
              });
              await log.save();
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: errorHandler.getErrorMessage(error)
            })
        }
        
        
    })
}

const update = async (req, res) => {
    const og = _.cloneDeep(req.originalproduct);
    let form = formidable();
    form.keepExtensions = true
    form.maxFileSize = 100 * 1024 * 1024;

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                success: false,
                error: "Images could not be uploaded"
            })
        }
        
        let { productname, productdescription, category, price, startedprice, location, itemsLeft, intialItemCount } = fields;
        let product = req.product;
        productname = productname ? productname.join(' ') : product.productname;
        productdescription = productdescription ? productdescription.join(' ') : product.productdescription;
        location = location ? location.join(' ') : product.location;

        let slug;
        if(productname) {
            slug = slugify(productname, {
                lower: true,
                strict: true,
              });
        }

        product = _.extend(product, {
            productname,
            productdescription,
            location,
            slug
        })
        
        if(files.productImages) {
            let arrayOfImages = [];
            files.productImages.forEach(image => {
                arrayOfImages.push({
                    data: fs.readFileSync(image.filepath),
                    contentType: image.mimetype
                })
            })
            product.productImages = arrayOfImages;
        }

        try {
            await product.save()
             res.status(200).json({
                success: true,
                product: product,
            })
      const updatedFields = [];
      const changedValues = {};
      const productKeys = Object.keys(product._doc);

      for (const key of productKeys) {
        if (
          key === "_id" ||
          key === "createdAt" ||
          key === "updatedAt" ||
          key === "shopId"
        ) {
          continue;
        }

        if (Array.isArray(product._doc[key])) {
          if (!arraysEqual(og._doc[key], product._doc[key])) {
            updatedFields.push(key);
            changedValues[key] = { old: og._doc[key], new: product._doc[key] };
          }
        } else if (og._doc[key] !== product._doc[key]) {
          updatedFields.push(key);
          changedValues[key] = { old: og._doc[key], new: product._doc[key] };
        }
      }

      const updatedFieldsString = updatedFields.join(", ");

      function arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length !== b.length) return false;

        for (let i = 0; i < a.length; i++) {
          if (a[i] !== b[i]) return false;
        }

        return true;
      }

      if (changedValues !== {}) {
        
        const log = new Log({
          user: req.auth._id,
          resource: "product",
          resourceid: product._id,
          action: "productupdate",
          description: `${updatedFieldsString} was updated`,
          details: changedValues,
        });

        await log.save();
      }
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: errorHandler.getErrorMessage(error)
            })
        }
        
        
    })


}

const listByShop = async (req, res) => {
    const shopid = JSON.stringify(req.shop._id);
    
    if (myCache.get(shopid)) {
        // console.log(myCache.get(shopid), 'myCache.get(shopid)');
        return res.status(200).json({
            success: true,
            products: myCache.get(shopid)
        })
    }

    try {
        let products = await Product.find({shopId: req.shop._id}).populate('shopId', '_id name').select('shopId productname productdescription slug auction updated created price location intialItemCount itemsLeft')
        // console.log('fetched!!');
        myCache.set(shopid, products, 0.5*60*60);

        res.status(200).json({
            success: true,
            products: products
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: errorHandler.getErrorMessage(error)
        })
    }
}


const remove = async (req, res, next) => {
    try {
        let product = req.product
        let deletedProduct = await Product.findByIdAndDelete(product._id)
         res.status(200).json({
            success: true,
            product: deletedProduct
        })
        const log = new Log({
            user: req.auth._id,
            resource: "product",
            resourceid: product._id,
            action: "productdelete",
            description: `${product.productname} was deleted`,
            details: deletedProduct,
          });
    
          await log.save();
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: errorHandler.getErrorMessage(error)
        })
    }
}

const list = async (req, res) => {
    try {
        let products = await Product.find().select('shopid productname productdescription slug auction updated created price location intialItemCount itemsLeft')
        res.status(200).json({
            success: true,
            products: products
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: errorHandler.getErrorMessage(error)
        })
    }
}

// trying to send multiple images to client
const photo = async (req, res, next) => {
    if (Array.isArray(req.product.productImages)) {
      res.set("Content-Type", "multipart/form-data");
      for (const file of req.product.productImages) {
        if (file.data) {
          res.write(`Content-Type: ${file.contentType}\r\n`);
          res.write(`Content-Length: ${file.data.length}\r\n`);
          res.write(`\r\n`);
          res.write(file.data);
          res.write(`\r\n`);
        }
      }
      res.end();
    //   console.log('multiple images sent!');
    } else {
      next();
    }
  };
  

const defaultPhoto = (req, res) => {
    return res.sendFile(process.cwd() + defaultImage)
}

const GetFeedForUser = async (req, res) => {
    const profile = req.user_profile
    const following = profile.following

    const postsFromFollowedUsers = await Product.find({owner: {$in: following}}).populate('comments.postedBy', '_id name').populate('postedBy', '_id name').sort('-created').exec()
    const { page, limit, startIndex, endIndex } = req.pagination;

    const paginatedPosts = postsFromFollowedUsers.slice(startIndex, endIndex);
    const totalPosts = postsFromFollowedUsers.length;

    res.json({
        success: true,
        posts: paginatedPosts,
        page,
        pages: Math.ceil(totalPosts / limit),
        total: totalPosts
    })
}

const paginationMiddleware = () => {
    pageSize = 5;
    return (req, res, next) => {
      const pageNumber = parseInt(req.query.page) || 1; 
      const startIndex = (pageNumber - 1) * pageSize;
      const endIndex = startIndex + pageSize;
  
      req.pagination = {
        page: pageNumber,
        limit: pageSize,
        startIndex,
        endIndex
      };
  
      next();
    };
  };

 export default { productByID, read, update, remove, create, list, photo, defaultPhoto, listByShop, GetFeedForUser, paginationMiddleware }