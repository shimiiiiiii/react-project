const Supplier = require('../models/supplier'); 
const APIFeatures = require('../utils/apiFeatures'); 

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
    try {
        const supplier = await Supplier.create(req.body);

        res.status(201).json({
            success: true,
            supplier
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Supplier not created',
            error: error.message
        });
    }
};

// Update Supplier
exports.updateSupplier = async (req, res, next) => {
    try {
        let supplier = await Supplier.findById(req.params.id);

        if (!supplier) {
            return res.status(404).json({
                success: false,
                message: 'Supplier not found'
            });
        }

        supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            supplier
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Supplier not updated',
            error: error.message
        });
    }
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
