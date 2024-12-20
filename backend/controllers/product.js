const Product = require('../models/product');
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require('cloudinary');
const Variety = require('../models/variety');

// Get All Products
exports.getProducts = async (req, res, next) => {
    try {
        const resPerPage = 4; 
        const productsCount = await Product.countDocuments();
        
        const apiFeatures = new APIFeatures(Product.find(), req.query);
        
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
            message: 'Server Error',
            error: error.message
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
    let product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }

    let images = [];

    if (typeof req.body.images === 'string') {
        images.push(req.body.images);
    } else if (Array.isArray(req.body.images)) {
        images = req.body.images;
    }

    if (images.length > 0) {
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id);
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
        // keep existing ones
        req.body.images = product.images;
    }
    console.log('Update data:', req.body);
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    console.log('Updated product:', product);
    return res.status(200).json({
        success: true,
        product
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

exports.getVarieties = async (req, res, next) => {
    try {
        // Fetch all varieties from the database
        const varieties = await Variety.find();

        // Send the varieties in the response
        res.status(200).json({
            success: true,
            varieties,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

// Get Products Grouped by Variety
exports.getProductMenu = async (req, res, next) => {
    try {
        // Define the varieties you want to fetch
        const varietyNames = ['Classic', 'Premium', 'Supreme', 'Munchkins', 'Other'];
        const menu = {};

        // Fetch last 4 products for each variety
        for (const varietyName of varietyNames) {
            const products = await Product.find()
                .populate({
                    path: 'varieties', // Populate the variety field
                    match: { name: varietyName }, // Filter by variety name
                    select: 'name', // Only fetch the variety name
                })
                .sort({ createdAt: -1 }) // Sort by most recent
                .limit(4); // Limit to 4 products

            // Only include products where the variety matches
            menu[varietyName] = products.filter((product) => product.varieties);
        }

        res.status(200).json({
            success: true,
            menu,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};

exports.getProductsByVariety = async (req, res) => {
    try {
        const { varietyId } = req.params; // varietyId comes from params
        const page = Number(req.query.page) || 1; // Default to page 1
        const limit = Number(req.query.limit) || 10; // Default to 10 products per page
        const skip = (page - 1) * limit;

        const products = await Product.find({ variety: varietyId })
            .populate('variety', 'name description images') // Populate variety details if needed
            .skip(skip)
            .limit(limit);

        const totalProducts = await Product.countDocuments({ variety: varietyId });

        res.status(200).json({
            success: true,
            products,
            page,
            totalPages: Math.ceil(totalProducts / limit),
        });
    } catch (error) {
        console.error('Error fetching products by variety:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};


exports.VarietyDetail = async (req, res) => {
    try {
      // Access varietyId from route parameters
      const { id: varietyId } = req.params;
  
      // Check if varietyId exists
      if (!varietyId) {
        return res.status(400).json({
          success: false,
          message: 'Variety ID is required',
        });
      }
  
      // Fetch products that belong to the specified varietyId and populate the variety field
      const products = await Product.find({ variety: varietyId })
        .populate('variety', 'name description images')  // Populate 'variety' field with name, description, and images
        .exec();
  
      if (!products || products.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No products found for this variety',
        });
      }
  
      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      console.error('Error fetching products by variety:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message,
      });
    }
  };
  
  exports.getAllProducts = async (req, res) => {
    try {
      // Fetch all products and populate the variety field
      const products = await Product.find().populate('variety', 'name'); // Populate only the name field of variety
  
      res.status(200).json({
        success: true,
        products, // Return products with populated variety names
      });
    } catch (error) {
      console.error('Error fetching all products:', error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message,
      });
    }
  };

  exports.bulkDelete = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'Invalid request: No IDs provided' });
        }

        // Deleting multiple products
        const result = await Product.deleteMany({ _id: { $in: ids } });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No products found to delete' });
        }

        return res.status(200).json({
            message: `${result.deletedCount} product(s) deleted successfully`,
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        console.error('Bulk delete error:', error);
        return res.status(500).json({ message: 'An error occurred while deleting products' });
    }
};
