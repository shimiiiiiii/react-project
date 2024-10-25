const Product = require('../models/product');
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require('cloudinary');

// Get All Products
exports.getProducts = async (req, res, next) => {
    try {
        const resPerPage = 4;
        const productsCount = await Product.countDocuments();
        
        const apiFeatures = new APIFeatures(Product.find(), req.query).search().filter();
        apiFeatures.pagination(resPerPage);
        
        const products = await apiFeatures.query;

        res.status(200).json({
            success: true,
            count: products.length,
            products,
            resPerPage,
            productsCount
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// Get Products for Admin
exports.getAdminProducts = async (req, res, next) => {

	const products = await Product.find();
	if (!products) {
		return res.status(404).json({
			success: false,
			message: 'Products not found',
            error: error.message
		})
	}
	return res.status(200).json({
		success: true,
		products
	})
}

// Get Single Product
exports.getSingleProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('supplier', 'name contactNumber email');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server Error'
        });
    }
};

// Create New Product
exports.newProduct = async (req, res, next) => {
	let images = []
	if (typeof req.body.images === 'string') {
		images.push(req.body.images)
	} else {
		images = req.body.images
	}

	let imagesLinks = [];

	for (let i = 0; i < images.length; i++) {
		
		// console.log(imageDataUri)
		try {
			const result = await cloudinary.v2.uploader.upload(images[i], {
				folder: 'products',
				width: 150,
				crop: "scale",
			});

			imagesLinks.push({
				public_id: result.public_id,
				url: result.secure_url
			})

		} catch (error) {
			console.log(error)
		}

	}

	req.body.images = imagesLinks
	req.body.user = req.user.id;

	const product = await Product.create(req.body);

	if (!product)
		return res.status(400).json({
			success: false,
			message: 'Product not created'
		})


	return res.status(201).json({
		success: true,
		product
	})
}
// Update Product
exports.updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // let images = [];
        // if (typeof req.body.images === 'string') {
        //     images.push(req.body.images);
        // } else {
        //     images = req.body.images;
        // }

        // if (images.length) {
        //     // Delete old images from cloudinary
        //     for (let i = 0; i < product.images.length; i++) {
        //         await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        //     }

        //     // Upload new images
        //     let imagesLinks = [];
        //     for (let i = 0; i < images.length; i++) {
        //         const result = await cloudinary.v2.uploader.upload(images[i], {
        //             folder: 'products',
        //             width: 150,
        //             crop: "scale",
        //         });

        //         imagesLinks.push({
        //             public_id: result.public_id,
        //             url: result.secure_url
        //         });
        //     }

        //     req.body.images = imagesLinks;
        // }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Product not updated',
            error: error.message
        });
    }
};
// Delete Product
exports.deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Product deleted'
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Product not deleted',
            error: error.message
        });
    }
};
