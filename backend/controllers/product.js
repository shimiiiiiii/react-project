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
    const { name, email, dateOfBirth, photos } = req.body;
    let user = await user.findById(req.user.id); 

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }

    let imagesLinks = [];

    // Handle image uploads
    if (photos) {
        // If the user has uploaded new photos, we handle the uploads
        if (typeof photos === 'string') {
            imagesLinks.push(photos);
        } else {
            // Assuming `photos` is an array of image URLs
            imagesLinks = photos;
        }

        // Delete old images if any
        if (user.photos.length > 0) {
            for (let i = 0; i < user.photos.length; i++) {
                const result = await cloudinary.v2.uploader.destroy(user.photos[i].public_id);
            }
        }

        // Upload new images to Cloudinary
        for (let i = 0; i < imagesLinks.length; i++) {
            const result = await cloudinary.v2.uploader.upload(imagesLinks[i], {
                folder: 'users', // Specify a folder for user photos
                width: 150,
                crop: "scale",
            });
            user.photos.push({
                public_id: result.public_id,
                url: result.secure_url
            });
        }
    }

    // Update user details
    user.name = name || user.name;
    user.email = email || user.email;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;

    await user.save();

    return res.status(200).json({
        success: true,
        user
    });
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
