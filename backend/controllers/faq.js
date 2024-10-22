const FAQ = require('../models/faq'); 
const cloudinary = require('cloudinary');

// Create FAQ
exports.createFAQ = async (req, res, next) => {
    try {
        const { question, answer } = req.body;
        let imgResult;

        if (req.file) {
            imgResult = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'photos', 
                width: 150,
                crop: "scale"
            });
        }

        const faq = await FAQ.create({
            question,
            answer,
            imgPath: imgResult ? {
                public_id: imgResult.public_id,
                url: imgResult.secure_url
            } : undefined
        });

        return res.status(201).json({
            success: true,
            faq
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Get All FAQs
exports.getAllFAQs = async (req, res, next) => {
    try {
        const faqs = await FAQ.find();

        return res.status(200).json({
            success: true,
            faqs
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Get FAQ by ID
exports.getFAQById = async (req, res, next) => {
    try {
        const faq = await FAQ.findById(req.params.id);
        
        if (!faq) {
            return res.status(404).json({ message: `FAQ not found with id: ${req.params.id}` });
        }

        return res.status(200).json({
            success: true,
            faq
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Update FAQ
exports.updateFAQ = async (req, res, next) => {
    try {
        const { question, answer } = req.body;
        let imgResult;

        if (req.file) {
            const faq = await FAQ.findById(req.params.id);
            if (faq.imgPath && faq.imgPath.public_id) {
                await cloudinary.v2.uploader.destroy(faq.imgPath.public_id);
            }
            imgResult = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'photos',
                width: 150,
                crop: "scale"
            });
        }

        const updatedFAQ = await FAQ.findByIdAndUpdate(req.params.id, {
            question,
            answer,
            imgPath: imgResult ? {
                public_id: imgResult.public_id,
                url: imgResult.secure_url
            } : undefined
        }, {
            new: true,
            runValidators: true
        });

        if (!updatedFAQ) {
            return res.status(404).json({ message: `FAQ not found with id: ${req.params.id}` });
        }

        return res.status(200).json({
            success: true,
            faq: updatedFAQ
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

// Delete FAQ
exports.deleteFAQ = async (req, res, next) => {
    try {
        const faq = await FAQ.findById(req.params.id);
        
        if (!faq) {
            return res.status(404).json({ message: `FAQ not found with id: ${req.params.id}` });
        }
        if (faq.imgPath && faq.imgPath.public_id) {
            await cloudinary.v2.uploader.destroy(faq.imgPath.public_id);
        }
        await FAQ.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            success: true,
            message: 'FAQ deleted successfully'
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
