const Category = require('../models/category');

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
};

exports.getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching category', error: error.message });
    }
};

exports.createCategory = async (req, res) => {
    const { name, description, image } = req.body;

    if (!name) return res.status(400).json({ message: 'Category name is required' });

    try {
        const newCategory = new Category({ name, description, image });
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: 'Error creating category', error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    const { name, description, image } = req.body;

    if (!name && !description && !image) return res.status(400).json({ message: 'At least one field is required to update' });

    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        category.name = name || category.name;
        category.description = description || category.description;
        category.image = image || category.image;
        category.updated_at = Date.now();

        await category.save();
        res.json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error updating category', error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        await category.remove();
        res.json({ message: 'Category deleted successfully', deletedCategory: category });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
};
