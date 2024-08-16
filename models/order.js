const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    products: [
        {
            product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true, min: 1 },
        },
    ],
    total_price: { type: Number, required: true, min: 0 },
    status: { 
        type: String, 
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], 
        default: 'Pending' 
    },
    payment_method: { type: String, default: 'Credit Card' },
    shipping_address: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        postal_code: { type: String, required: true },
        country: { type: String, required: true },
        phone: { type: String, required: true }
    },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
