const express = require('express');
const {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    getProductsByCategory
} = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   POST /api/products
// @desc    Create a new product
// @access  Private
router.post('/', authMiddleware, upload.single('image'), createProduct);

// @route   GET /api/products
// @desc    Get all products with pagination and filtering
// @access  Public
router.get('/', getProducts);

// @route   GET /api/products/category/:category
// @desc    Get products by category
// @access  Public
router.get('/category/:category', getProductsByCategory);

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', getProduct);

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private
router.put('/:id', authMiddleware, upload.single('image'), updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private
router.delete('/:id', authMiddleware, deleteProduct);

module.exports = router;
