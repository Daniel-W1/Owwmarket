import { User, GoogleUser } from '../models/user.schema.js'
import _ from 'lodash'
import errorHandler from '../helpers/dbhelper.js';
import {Product, ProductAuction} from '../models/product.schema.js';
import slugify from "slugify";
import formidable from 'formidable';
import fs from 'fs';

const defaultImage = '/public/files/default.png'

const productByID = async (req, res, next, id) => { 
    try {
        const product = await Product.findById(id);
        if (!product)
            return res.status(400).json({
                success: false,
                error: "Product not found"
            })
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
    console.log('we are here');
    let form = formidable();
    form.keepExtensions = true
    form.maxFileSize = 100 * 1024 * 1024;
    // console.log('shop', req.shop);
    const shopid = req.shop._id;
    
    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                success: false,
                error: "Images could not be uploaded"
            })
        }
        
        let { productname, productdescription, category, quantity, price, auction, startedprice, location } = fields;
        

        // console.log(shopid, 'shopid');
        
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
                shopId: shopid,
                productname: productname.join(' '),
                productdescription: productdescription.join(' '),
                category: category.join(' '),
                quantity: +quantity.join(' '),
                startedprice: startedprice ? +startedprice.join(' ') : 0,
                slug,
                auction: true,
                location
              });
        } else {
             product = new Product({
                shopId: shopid,
                productname: productname.join(' '),
                productdescription: productdescription.join(' '),
                category: category.join(' '),
                quantity: +quantity.join(' '), 
                price: +price.join(' '),
                slug,
                location
            })     
        }
        // console.log('product', product, product.shopId, 'shopid', product.productname, 'productname', product.auction, 'auction');
        // process images
        if(files.productimages) {
            let arrayOfImages = [];
            files.productimages.forEach(image => {
                arrayOfImages.push({
                    data: fs.readFileSync(image.filepath),
                    contentType: image.mimetype
                })
            })
            product.productImages = arrayOfImages;
            // console.log(arrayOfImages, 'array of images');
        }

        try {
            // console.log(product.shopid, 'shopid', product.productname, 'productname', product.auction, 'auction');
            await product.save()
            return res.status(200).json({
                success: true,
                product: product,
            })
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: errorHandler.getErrorMessage(error)
            })
        }
        
        
    })
    console.log('no form data lol');
}

const update = async (req, res) => {
    // try {
    //     let product = req.product
    //     product = _.extend(product, req.body)
    //     product.updated = Date.now()
    //     await product.save()
    //     return res.json({
    //         success: true,
    //         product: product
    //     })
    // } catch (error) {
    //     return res.status(400).json({
    //         success: false,
    //         error: errorHandler.getErrorMessage(error)
    //     })
    // }

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
        
        let { productname, productdescription, category, quantity, price, startedprice, location } = fields;
        let product = req.product;
        productname = productname ? productname.join(' ') : product.productname;
        productdescription = productdescription ? productdescription.join(' ') : product.productdescription;
        quantity = quantity ? +quantity.join(' ') : product.quantity;
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
            quantity,
            location,
            slug
        })
        // console.log('product', product, product.shopId, 'shopid', product.productname, 'productname', product.auction, 'auction');
        // process images
        if(files.productimages) {
            let arrayOfImages = [];
            files.productimages.forEach(image => {
                arrayOfImages.push({
                    data: fs.readFileSync(image.filepath),
                    contentType: image.mimetype
                })
            })
            product.productImages = arrayOfImages;
            // console.log(arrayOfImages, 'array of images');
        }

        try {
            // console.log(product.shopid, 'shopid', product.productname, 'productname', product.auction, 'auction');
            await product.save()
            return res.status(200).json({
                success: true,
                product: product,
            })
        } catch (error) {
            return res.status(400).json({
                success: false,
                error: errorHandler.getErrorMessage(error)
            })
        }
        
        
    })


}

const remove = async (req, res, next) => {
    try {
        let product = req.product
        let deletedProduct = await Product.findByIdAndDelete(product._id)
        return res.status(200).json({
            success: true,
            product: deletedProduct
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: errorHandler.getErrorMessage(error)
        })
    }
}

const list = async (req, res) => {
    try {
        let products = await Product.find().select('shopid productname productdescription slug auction updated created')
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

 export default { productByID, read, update, remove, create, list, photo, defaultPhoto }