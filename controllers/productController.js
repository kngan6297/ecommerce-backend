const mongoose = require('mongoose');
const Product = require('../models/product');
const Category = require('../models/category');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Lấy tất cả sản phẩm với phân trang
exports.getAllProducts = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const products = await Product.find()
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        res.json(products);
    } catch (error) {
        console.error('Error in getAllProducts:', error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const id = req.params.id;

        // Kiểm tra ObjectId hợp lệ
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid Product ID' });
        }

        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        res.json(product);
    } catch (error) {
        console.error('Error in getProductById:', error.message);
        res.status(500).json({ message: error.message });
    }
};


// Thêm sản phẩm mới
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category_id, images, brand, material, scale, release_date } = req.body;

        // Kiểm tra các trường thông tin
        if (!name || !price || !category_id) return res.status(400).json({ message: 'Name, price, and category_id are required' });

        // Kiểm tra danh mục có tồn tại hay không
        const category = await Category.findById(category_id);
        if (!category) return res.status(400).json({ message: 'Category does not exist' });

        const newProduct = new Product({
            name,
            description,
            price,
            category_id,
            images,
            brand,
            material,
            scale,
            release_date,
        });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error in createProduct:', error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { name, description, price, category_id, images, brand, material, scale, release_date } = req.body;

        // Kiểm tra sản phẩm có tồn tại không
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Cập nhật thông tin sản phẩm
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category_id = category_id || product.category_id;
        product.images = images || product.images;
        product.brand = brand || product.brand;
        product.material = material || product.material;
        product.scale = scale || product.scale;
        product.release_date = release_date || product.release_date;
        product.updated_at = Date.now();

        await product.save();
        res.json(product);
    } catch (error) {
        console.error('Error in updateProduct:', error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        await product.remove();
        res.json({ message: 'Product deleted' });
    } catch (error) {
        console.error('Error in deleteProduct:', error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.searchProducts = async (req, res) => {
    try {
        const { name, category } = req.body; // Lấy tham số từ req.body
        const query = {};

        if (name) {
            // Tạo biểu thức chính quy để tìm kiếm với từ khóa `name`
            query.name = new RegExp(name, 'i'); // Tìm kiếm không phân biệt chữ hoa chữ thường
        }

        if (category) {
            // Kiểm tra xem category có phải là ObjectId hợp lệ không
            if (!isValidObjectId(category)) {
                console.error('Invalid category ID:', category);
                return res.status(400).json({ message: 'Invalid category ID' });
            }
            query.category_id = new mongoose.Types.ObjectId(category);
        }

        console.log('Query:', query); // Kiểm tra xem truy vấn có chính xác không

        // Thực hiện truy vấn
        const products = await Product.find(query);

        if (products.length === 0) {
            console.log('No products found');
        } else {
            console.log('Products found:', products);
        }

        res.json(products);
    } catch (error) {
        console.error('Error in searchProducts:', error.message);
        res.status(500).json({ message: error.message });
    }
};


exports.filterProducts = async (req, res) => {
    try {
        const { price_min, price_max, sort } = req.body; // Lấy tham số từ req.body
        const query = {};

        // Lọc theo giá
        if (price_min) query.price = { $gte: parseFloat(price_min) };
        if (price_max) query.price = query.price ? { ...query.price, $lte: parseFloat(price_max) } : { $lte: parseFloat(price_max) };

        // Lấy sản phẩm từ cơ sở dữ liệu với các tiêu chí lọc
        let productsQuery = Product.find(query);

        // Sắp xếp theo yêu cầu
        if (sort) {
            if (sort === 'price') {
                productsQuery = productsQuery.sort({ price: 1 }); // Sắp xếp tăng dần theo giá
            } else if (sort === 'date') {
                productsQuery = productsQuery.sort({ release_date: -1 }); // Sắp xếp giảm dần theo ngày phát hành
            }
        }

        // Thực hiện truy vấn và trả về kết quả
        const products = await productsQuery;
        res.json(products);
    } catch (error) {
        console.error('Error in filterProducts:', error.message);
        res.status(500).json({ message: error.message });
    }
};

