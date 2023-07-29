import formidable from 'formidable';
import fs from 'fs';
import extend from 'lodash/extend.js';
import Profile from '../models/profile.schema.js';

// const create = async (req, res, next) => {
//     let form = new formidable.IncomingForm();
//     form.keepExtensions = true;

//     form.parse(req, async (err, fields, files) => {
//         if (err) return res.status(400).json({ error: 'Image could not be uploaded' });
//     });

//     const profile = new Profile(fields);
//     profile.owner = req.profile;
    
//     if (files.photo){
//         profile.image.data = fs.readFileSync(files.photo.path);
//         profile.image.contentType = files.photo.type;
//     }

//     try {
//         let profile = await profile.save();
//         res.json(profile);
//     } catch (error) {
//         return res.status(400).json({
//             error: errorHandler.getErrorMessage(error)
//         });
//     }
// }

const updateProfile = async (req, res) => {
    let form = formidable({ multiples: false })
    form.keepExtensions = true;
    form.maxFileSize = 50 * 1024 * 1024; // 5MB

    form.parse(req, async (err, fields, files) => {
        if (err) return res.status(400).json({ error: 'Image could not be uploaded' });
    });

    let profile = req.user_profile;
    profile = extend(profile, fields);

    if (files.photo){
        profile.image.data = fs.readFileSync(files.image[0].filepath);
        profile.image.contentType = files.image[0].type;
    }

    try {
        let profile = await profile.save();
        res.json(profile);
    } catch (error) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(error)
        });
    }
}

const profileByID = async (req, res, next, id) => {
    try {
        let profile = await Profile.findById(id);
        if (!profile) return res.status(400).json({ error: "Profile not found" });
        req.user_profile = profile;
        next();
    } catch (error) {
        return res.status(400).json({ error: "Could not retrieve profile" });
    }
}

const profileByUserId = async (req, res) => {
    try {
        let id = req.profile._id;
        let profile = await Profile.findOne({owner: id});
        if (!profile) return res.status(400).json({ error: "Profile not found" });
        req.user_profile = profile;
        return res.json(profile);
    } catch (error) {
        return res.status(400).json({ error: "Could not retrieve profile" });
    }
}

const read = async (req, res) => {
    req.user_profile.image = undefined;
    return res.json(req.user_profile);
}

const remove = async (req, res) => {
    try {
        let profile = req.user_profile;
        let deletedProfile = await profile.remove();
        res.json(deletedProfile);
    } catch (error) {
        return res.status(400).json({ error: errorHandler.getErrorMessage(error) });
    }
}

const photo = (req, res, next) => {
    if (req.user_profile.image.data) {
        res.set("Content-Type", req.user_profile.image.contentType);
        return res.send(req.user_profile.image.data);
    }
    next();
}

const isOwner = (req, res, next) => {
    const isOwner = req.user_profile && req.auth && req.user_profile.owner._id == req.auth._id;
    if (!isOwner) return res.status(403).json({ error: "User is not authorized" });
    next();
}


export default { profileByID, profileByUserId, remove, photo, isOwner, updateProfile, read };