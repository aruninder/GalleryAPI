const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

// Helper function to upload image to Cloudinary
const uploadToCloudinary = async (file) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                folder: 'product-gallery',
                resource_type: 'image'
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        ).end(file.buffer);
    });
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
    try {
        const { title, description, category, price, inStock } = req.body;

        // Check if image is provided
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Product image is required'
            });
        }

        // Upload image to Cloudinary
        const uploadResult = await uploadToCloudinary(req.file);

        // Create product
        const product = new Product({
            title,
            description,
            imageURL: uploadResult.secure_url,
            imagePublicId: uploadResult.public_id,
            shopId: req.user._id,
            category,
            price: price ? parseFloat(price) : undefined,
            inStock: inStock === 'false' ? false : true
        });

        await product.save();

        // Populate shop info
        await product.populate('shopId', 'username shopName');

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            data: {
                product
            }
        });

    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error creating product'
        });
    }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build filter object
        const filter = {};

        if (req.query.category) {
            filter.category = req.query.category;
        }

        if (req.query.shopId) {
            filter.shopId = req.query.shopId;
        }

        if (req.query.search) {
            filter.$text = { $search: req.query.search };
        }

        // Get products with pagination
        const products = await Product.find(filter)
            .populate('shopId', 'username shopName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Get total count for pagination
        const total = await Product.countDocuments(filter);

        res.json({
            success: true,
            data: {
                products,
                pagination: {
                    page,
                    pages: Math.ceil(total / limit),
                    total,
                    limit
                }
            }
        });

    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching products'
        });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('shopId', 'username shopName email');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.json({
            success: true,
            data: {
                product
            }
        });

    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching product'
        });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if user owns the product
        if (product.shopId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only update your own products.'
            });
        }

        const { title, description, category, price, inStock } = req.body;
        let updateData = {
            title: title || product.title,
            description: description || product.description,
            category: category || product.category,
            price: price !== undefined ? parseFloat(price) : product.price,
            inStock: inStock !== undefined ? (inStock === 'false' ? false : true) : product.inStock
        };

        // If new image is provided, upload to Cloudinary and delete old image
        if (req.file) {
            // Delete old image from Cloudinary
            if (product.imagePublicId) {
                await cloudinary.uploader.destroy(product.imagePublicId);
            }

            // Upload new image
            const uploadResult = await uploadToCloudinary(req.file);
            updateData.imageURL = uploadResult.secure_url;
            updateData.imagePublicId = uploadResult.public_id;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).populate('shopId', 'username shopName');

        res.json({
            success: true,
            message: 'Product updated successfully',
            data: {
                product: updatedProduct
            }
        });

    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating product'
        });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Check if user owns the product
        if (product.shopId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. You can only delete your own products.'
            });
        }

        // Delete image from Cloudinary
        if (product.imagePublicId) {
            await cloudinary.uploader.destroy(product.imagePublicId);
        }

        // Delete product from database
        await Product.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });

    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error deleting product'
        });
    }
};

// @desc    Get products by category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const products = await Product.find({ category })
            .populate('shopId', 'username shopName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments({ category });

        res.json({
            success: true,
            data: {
                products,
                pagination: {
                    page,
                    pages: Math.ceil(total / limit),
                    total,
                    limit
                }
            }
        });

    } catch (error) {
        console.error('Get products by category error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error fetching products by category'
        });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory
};
