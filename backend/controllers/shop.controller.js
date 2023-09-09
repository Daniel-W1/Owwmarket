import errorHandler from '../helpers/dbhelper.js'
import Shop from '../models/shop.schema.js'
import Log from '../models/log.schema.js'
import formidable from 'formidable'
import fs from 'fs'
import _ from 'lodash'
import { myCache } from '../index.js'
import { imagefrombuffer } from "imagefrombuffer"; //first import 
import { User } from '../models/user.schema.js'
import { log } from 'console'


const defaultImage = '/public/default.png'

const create = async (req, res) => {
    let form = formidable({multiples:false});
    form.keepExtensions = true
    form.maxFileSize = 50 * 1024 * 1024; // 5MB

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                success: false,
                error: "Image could not be uploaded"
            })
        }

        let shop = new Shop({
            name: fields.name.join(' '),
            description: fields.description.join(' '),
        })

        req.profile.hashed_password = undefined
        req.profile.salt = undefined

        shop.owner = req.profile

        if (files.image) {
            shop.image.data = fs.readFileSync(files.image[0].filepath)
            shop.image.contentType = files.image[0].mimetype
        }

        try {
            let result = await shop.save()
            res.status(200).json({
                success: true,
                shop: result,
            })
            // logs
           
            const log = new Log({
                user: shop.owner,
                resource: "shop",
                resourceid: result._id,
                action: "shopcreate",
                description: `${result.name} was created`,
                details: result,
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


const shopbyId = async (req, res, next, id) => {
    try {
        let shop = await Shop.findById(id)
        if (!shop) {
            return res.status(400).json({
                success: false,
                error: "Shop not found"
            })}
        
        req.shop = shop
        next()

    } catch (error) {
        return res.status(400).json({
            success: false,
            error: "Could not retrieve shop"
        })
    }
}

const photo = (req, res, next) => {
    if (req.shop.image.data) {
        console.log('image found');
        res.set('Content-Type', req.shop.image.contentType)
        return res.send(req.shop.image.data)
    }
    next()
}

const defaultPhoto = (req, res) => {
    const defaultImagePath = process.cwd() + defaultImage;
    try {
        console.log('default');
        const defaultImageBuffer = fs.readFileSync(defaultImagePath);
        if (defaultImageBuffer) {
            res.set('Content-Type', 'image/png'); 
            return res.send(defaultImageBuffer);
        }
    } catch (error) {
        console.error('Error reading default image:', error);
    }

    res.status(404).send('Default image not available');
}

const read = (req, res) => {
    req.shop.image = undefined
    return res.json(req.shop)
}

const update = async (req, res) => {
    const og = _.cloneDeep(req.shop);
    let form = formidable({multiples:false})
    form.keepExtensions = true

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                success: false,
                error: "Photo could not be uploaded"
            })
        }
        let shop = req.shop
        const updates = {
            name: fields.name.join(' '),
            description: fields.description.join(' '),
        }

        
        shop = _.extend(shop, updates)
        console.log(files.image);
        
        if (files.image) {  
            shop.image.data = fs.readFileSync(files.image[0].filepath)
            shop.image.contentType = files.image[0].mimetype
        }
        try {
            
            // console.log('we are here', shop);
            let result = await shop.save()
            res.status(200).json({
                success: true,
                shop: result,
            })
            const updatedFields = [];
            const changedValues = {};
            const productKeys = Object.keys(shop._doc);
      
            for (const key of productKeys) {
              if (
                key === "_id" ||
                key === "createdAt" ||
                key === "updatedAt" ||
                key === "owner"
              ) {
                continue;
              }
      
              if (Array.isArray(shop._doc[key])) {
                if (!arraysEqual(og._doc[key], shop._doc[key])) {
                  updatedFields.push(key);
                  changedValues[key] = { old: og._doc[key], new: shop._doc[key] };
                }
              } else if (og._doc[key] !== shop._doc[key]) {
                updatedFields.push(key);
                changedValues[key] = { old: og._doc[key], new: shop._doc[key] };
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
      
            if (Object.keys(changedValues).length > 0) {
              
              const log = new Log({
                user: req.auth._id,
                resource: "shop",
                resourceid: shop._id,
                action: "shopupdate",
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

const remove = async (req, res) => {
    try {
        let shop = req.shop
        let deletedShop = await Shop.findByIdAndDelete(shop._id)
        res.status(200).json({
            success: true,
            shop: deletedShop,
        })
        // logs       
        const log = new Log({
            user: deletedShop.owner,
            resource: "shop",
            resourceid: deletedShop._id,
            action: "shopdelete",
            description: `${deletedShop.name} was deleted`,
            details: deletedShop,
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
        let shops = await Shop.find()
        res.json(shops)
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: errorHandler.getErrorMessage(error)
        })
    }
}

const listByOwner = async (req, res) => {
    const userId = JSON.stringify(req.profile._id)

    if (myCache.get(userId) !== undefined) {
        // console.log(myCache.get(userId), 'myCache.get(userId)');
        return res.status(200).json(
            myCache.get(userId)
        )
    }

    try {
        let shops = await Shop.find({ owner: req.profile._id }).sort('-created')
        console.log('fetched!!!');
        myCache.set(userId, shops, 0.5*60*60);
        res.json(shops)
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: errorHandler.getErrorMessage(error)
        })
    }
}

const isOwner = (req, res, next) => {
    const isOwner = req.shop && req.auth && req.shop.owner._id == req.auth._id
    // console.log('owner is ', isOwner);
    if (!isOwner) {
        return res.status(403).json({
            success: false,
            error: "User is not authorized"
        })
    }
    next()
}

export default { create, shopbyId, photo, read, update, remove, list, listByOwner, isOwner, defaultPhoto }