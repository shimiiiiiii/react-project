const Variety = require('../models/variety'); 
const APIFeatures = require('../utils/apiFeatures'); 
const cloudinary = require('cloudinary');

// Get All Varieties
exports.getVarieties = async (req, res, next) => {
    try {
        const resPerPage = 4; 
        const varietiesCount = await Variety.countDocuments();
        
        const apiFeatures = new APIFeatures(Variety.find(), req.query);
        
        const varieties = await apiFeatures.query;

        res.status(200).json({
            success: true,
            count: varieties.length,
            varieties,
            resPerPage,
            varietiesCount
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Get Single Variety
exports.getSingleVariety = async (req, res, next) => {
    try {
        const variety = await Variety.findById(req.params.id);

        if (!variety) {
            return res.status(404).json({
                success: false,
                message: 'Variety not found'
            });
        }

        res.status(200).json({
            success: true,
            variety
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Create New Variety
exports.newVariety = async (req, res, next) => {

    let images = [];

    // Check if images are base64-encoded strings
    if (typeof req.body.images === 'string') {
        images.push(req.body.images); // Single base64 string
    } else {
        images = req.body.images; // Multiple base64 strings in an array
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        try {
            // Upload the base64 image to Cloudinary
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'photos',
            });

            // Push the result (URLs) to imagesLinks
            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        } catch (error) {
            console.log('Cloudinary upload error:', error);
        }
    }

    // Replace req.body.images with the processed images
    req.body.images = imagesLinks;

    try {
        // Create the new variety
        const variety = await Variety.create(req.body);

        if (!variety) {
            return res.status(400).json({
                success: false,
                message: 'Variety not created',
            });
        }

        return res.status(201).json({
            success: true,
            variety,
        });
    } catch (error) {
        console.error('Error creating variety:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error while creating variety',
        });
    }
};

// Update Variety
exports.updateVariety = async (req, res, next) => {
    let variety = await Variety.findById(req.params.id);

    if (!variety) {
        return res.status(404).json({
            success: false,
            message: 'Variety not found'
        });
    }

    let images = [];

    // Check if images are provided as strings (URLs or base64 encoded)
    if (typeof req.body.images === 'string') {
        images.push(req.body.images);
    } else if (Array.isArray(req.body.images)) {
        images = req.body.images;
    }

    // If images are provided, handle the upload and replace the existing images
    if (images.length > 0) {
        // Delete old images from Cloudinary
        for (let i = 0; i < variety.images.length; i++) {
            await cloudinary.v2.uploader.destroy(variety.images[i].public_id);
        }

        let imagesLinks = [];
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'photos', 
                width: 150,
                crop: "scale",
            });
            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            });
        }

        // Update images in the request body
        req.body.images = imagesLinks;
    } else {
        // If no new images, keep existing ones
        req.body.images = variety.images;
    }

    // Update the variety with new data
    variety = await Variety.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    return res.status(200).json({
        success: true,
        variety
    });
};

// Delete Variety
exports.deleteVariety = async (req, res, next) => {
    try {
        const variety = await Variety.findByIdAndDelete(req.params.id);
        if (!variety) {
            return res.status(404).json({
                success: false,
                message: 'Variety not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Variety deleted'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Variety not deleted',
            error: error.message
        });
    }
};
