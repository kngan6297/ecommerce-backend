const express = require('express');
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    filterProducts
} = require('../controllers/productController');
const auth = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/roleMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management endpoints
 */

/**
 * @swagger
 * /v1/products:
 *   get:
 *     tags: [Products]
 *     summary: Get all products
 *     description: Retrieve a list of all products. Accessible by all users.
 *     responses:
 *       200:
 *         description: Successfully retrieved all products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error fetching products
 */

/**
 * @swagger
 * /v1/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get product by ID
 *     description: Retrieve a specific product by its ID. Accessible by all users.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Error fetching product
 */

/**
 * @swagger
 * /v1/products:
 *   post:
 *     tags: [Products]
 *     summary: Create a new product
 *     description: Create a new product. Only accessible by admins.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Successfully created the product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error creating product
 */

/**
 * @swagger
 * /v1/products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Update an existing product
 *     description: Update a specific product by its ID. Only accessible by admins.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Successfully updated the product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error updating product
 */

/**
 * @swagger
 * /v1/products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Delete a product
 *     description: Delete a specific product by its ID. Only accessible by admins.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully deleted the product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedProduct:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Error deleting product
 */

/**
 * @swagger
 * /v1/products/search:
 *   post:
 *     tags: [Products]
 *     summary: Search products
 *     description: Search products based on request body parameters. Accessible by all users.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the product to search
 *               category:
 *                 type: string
 *                 description: ID of the category to filter products by
 *             example:
 *               name: "Naruto"
 *               category: "64c4a2b1d74e1f000d9b8e5c"
 *     responses:
 *       200:
 *         description: Successfully retrieved search results
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error performing search
 */

/**
 * @swagger
 * /v1/products/filter:
 *   post:
 *     tags: [Products]
 *     summary: Filter products
 *     description: Filter products based on request body parameters. Accessible by all users.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category:
 *                 type: string
 *                 description: ID of the category to filter products by
 *               price_min:
 *                 type: number
 *                 format: float
 *                 description: Minimum price to filter products by
 *               price_max:
 *                 type: number
 *                 format: float
 *                 description: Maximum price to filter products by
 *               sort:
 *                 type: string
 *                 description: Sorting criteria (e.g., "price", "date")
 *             example:
 *               category: "64c4a2b1d74e1f000d9b8e5c"
 *               price_min: 100
 *               price_max: 500
 *               sort: "price"
 *     responses:
 *       200:
 *         description: Successfully retrieved filtered products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error performing filter
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *           format: float
 *         category:
 *           type: string
 *         stock:
 *           type: integer
 *         image:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       required:
 *         - name
 *         - price
 *         - category
 */

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', auth(), roleMiddleware(['admin']), createProduct); 
router.put('/:id', auth(), roleMiddleware(['admin']), updateProduct); 
router.delete('/:id', auth(), roleMiddleware(['admin']), deleteProduct); 
//router.get('/search', searchProducts);
router.post('/search', searchProducts);
//router.get('/filter', filterProducts);
router.post('/filter', filterProducts);
module.exports = router;
