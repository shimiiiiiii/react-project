const Supplier = require('../models/supplier'); 
const APIFeatures = require('../utils/apiFeatures'); 
const cloudinary = require('cloudinary');

// Get All Suppliers
exports.getSuppliers = async (req, res, next) => {
    try {
        const resPerPage = 4; 
        const suppliersCount = await Supplier.countDocuments();
        
        const apiFeatures = new APIFeatures(Supplier.find(), req.query); // filtering
        // apiFeatures.pagination(resPerPage);
        
        const suppliers = await apiFeatures.query;

        res.status(200).json({
            success: true,
            count: suppliers.length,
            suppliers,
            resPerPage,
            suppliersCount
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Get Single Supplier
exports.getSingleSupplier = async (req, res, next) => {
    try {
        const supplier = await Supplier.findById(req.params.id);

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: 'Supplier not found'
            });
        }

        res.status(200).json({
            success: true,
            supplier
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Create New Supplier
exports.newSupplier = async (req, res, next) => {

    let images = [];
    if (typeof req.body.images === 'string') {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        try {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'photos',
            });

            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        } catch (error) {
            console.log('Cloudinary upload error:', error);
        }
    }

    req.body.images = imagesLinks;

    const supplier = await Supplier.create(req.body);

    if (!supplier) {
        return res.status(400).json({
            success: false,
            message: 'Supplier not created',
        });
    }

    return res.status(201).json({
        success: true,
        supplier,
    });
};

// Update Supplier
exports.updateSupplier = async (req, res, next) => {
    let supplier = await Supplier.findById(req.params.id);
    
    if (!supplier) {
        return res.status(404).json({
            success: false,
            message: 'Supplier not found'
        });
    }

    let images = [];

    if (typeof req.body.images === 'string') {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }

    if (images != undefined) {
        for (let i = 0; i < supplier.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(supplier.images[i].public_id);
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

        req.body.images = imagesLinks;
    } else {
        req.body.images = supplier.images; 
    }

    supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    return res.status(200).json({
        success: true,
        supplier
    });
};

// Delete Supplier
exports.deleteSupplier = async (req, res, next) => {
    try {
        const supplier = await Supplier.findByIdAndDelete(req.params.id);
        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: 'Supplier not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Supplier deleted'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Supplier not deleted',
            error: error.message
        });
    }
};
