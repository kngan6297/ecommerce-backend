const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/roleMiddleware');

const productRoutes = require('./products');
const categoryRoutes = require('./categories');
const customerRoutes = require('./customers');
const orderRoutes = require('./orders');
const authRoutes = require('./auth');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication routes
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management routes
 */

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management routes
 */

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management routes
 */

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management routes
 */

/**
 * @swagger
 * /v1/products:
 *   get:
 *     tags:
 *       - Products
 *     summary: Get all products
 *     description: Endpoint for retrieving all products
 *     responses:
 *       200:
 *         description: List of products
 *       500:
 *         description: Error retrieving products
 */

/**
 * @swagger
 * /v1/categories:
 *   get:
 *     tags:
 *       - Categories
 *     summary: Get all categories
 *     description: Endpoint for retrieving all categories
 *     responses:
 *       200:
 *         description: List of categories
 *       500:
 *         description: Error retrieving categories
 */

/**
 * @swagger
 * /v1/customers:
 *   get:
 *     tags:
 *       - Customers
 *     summary: Get all customers
 *     description: Endpoint for retrieving all customers. Requires authentication and admin role.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of customers
 *       500:
 *         description: Error retrieving customers
 */

/**
 * @swagger
 * /v1/orders:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get all orders
 *     description: Endpoint for retrieving all orders. Requires authentication and admin role.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 *       500:
 *         description: Error retrieving orders
 */

router.use('/v1/auth', authRoutes);
router.use('/v1/products', productRoutes);
router.use('/v1/categories', categoryRoutes);
router.use('/v1/customers', customerRoutes);
router.use('/v1/orders', orderRoutes);

module.exports = router;
