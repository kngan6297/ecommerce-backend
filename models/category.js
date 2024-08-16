const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: String,
    description: String,
    image: String,
    created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Category', categorySchema);
