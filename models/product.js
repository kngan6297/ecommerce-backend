const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    category_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    images: [String],
    brand: String,
    material: String, 
    scale: String, 
    release_date: Date, 
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', productSchema);
