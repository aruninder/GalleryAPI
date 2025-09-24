const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Product title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    imageURL: {
        type: String,
        required: [true, 'Product image is required']
    },
    imagePublicId: {
        type: String,
        required: true // Store Cloudinary public ID for deletion
    },
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Shop ID is required']
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        enum: {
            values: ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Toys', 'Health & Beauty', 'Food & Beverages', 'Automotive', 'Other'],
            message: 'Category must be one of: Electronics, Fashion, Home & Garden, Sports, Books, Toys, Health & Beauty, Food & Beverages, Automotive, Other'
        }
    },
    price: {
        type: Number,
        min: [0, 'Price cannot be negative']
    },
    inStock: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for faster queries
productSchema.index({ category: 1 });
productSchema.index({ shopId: 1 });
productSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
