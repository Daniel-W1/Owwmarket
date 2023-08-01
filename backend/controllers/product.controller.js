import { User, GoogleUser } from '../models/user.schema.js'
import _ from 'lodash'
import errorHandler from '../helpers/dbhelper.js';
import {Product, ProductAuction} from '../models/product.schema.js';
import slugify from "slugify";

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
    const { shopid, productname, productdescription, productimages, category, quantity, price, auction, startedprice, location } = req.body;
    try {
        let productExists = await Product.findOne({ "shopid": shopid,"productname": productname })
        if (productExists)
        return res.status(403).json({
            success: false,
            error: "This product name already in the shop!"
        })

        let slug;
        if(productname) {
            slug = slugify(productname, {
                lower: true,
                strict: true,
              });
        }

        let product;
        if(auction) {
             product = new ProductAuction({
                shopid,
                productname,
                productdescription,
                category,
                quantity, 
                startedprice,
                slug,
                auction: true,
                location
              });
        } else {
             product = new Product({
                shopid,
                productname,
                productdescription,
                category,
                quantity, 
                price,
                slug,
                location
            })     
        }
        await product.save()

        
        return res.status(200).json({
            success: true,
            product: product,
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            error: errorHandler.getErrorMessage(error)
        })
    }
}

const update = async (req, res) => {
    try {
        let product = req.product
        product = _.extend(product, req.body)
        product.updated = Date.now()
        await product.save()
        return res.json({
            success: true,
            product: product
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

 export default { productByID, read, update, remove, create, list }