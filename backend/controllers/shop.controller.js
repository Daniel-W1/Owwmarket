import errorHandler from '../helpers/dbhelper.js'
import Shop from '../models/shop.schema.js'
import formidable from 'formidable'
import fs from 'fs'
import _ from 'lodash'

const defaultImage = '/public/files/default.png'

const create = async (req, res) => {
    let form = formidable({multiples:false});
    form.keepExtensions = true
    form.maxFileSize = 50 * 1024 * 1024; // 5MB

    // console.log(form);
    form.parse(req, async (err, fields, files) => {
        // console.log(fields);
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
            res.json(result)
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
        // console.log('the id is ', id);
        // console.log(shop, 'shop found');
        let shop = await Shop.findById(id)
        if (!shop)
            return res.status(400).json({
                success: false,
                error: "Shop not found"
            })
        
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
    // console.log('here', req.shop.image.data);
    if (req.shop.image.data !== undefined) {
        res.set("Content-Type", req.shop.image.contentType)
        return res.send(req.shop.image.data)
    }
    next()
}

const defaultPhoto = (req, res) => {
    console.log('here');
    return res.sendFile(process.cwd() + defaultImage)
}

const read = (req, res) => {
    req.shop.image = undefined
    return res.json(req.shop)
}

const update = async (req, res) => {
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
            res.json(result)
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
        res.json(deletedShop)
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
    try {
        let shops = await Shop.find({ owner: req.profile._id }).sort('-created')
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
    console.log('owner is ', isOwner);
    if (!isOwner) {
        return res.status(403).json({
            success: false,
            error: "User is not authorized"
        })
    }
    next()
}

export default { create, shopbyId, photo, read, update, remove, list, listByOwner, isOwner, defaultPhoto }