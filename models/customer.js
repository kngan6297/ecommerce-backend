const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: String,
    phone: String,
    username: { type: String, required: true, unique: true },
    date_of_birth: Date,
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Customer', customerSchema);
