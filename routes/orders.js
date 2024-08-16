const express = require('express');
const router = express.Router();
const {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
    getAllOrdersForCustomer,
    getOrderByIdForCustomer,
    updateShippingAddress
} = require('../controllers/orderController');
const auth = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management endpoints
 */

/**
 * @swagger
 * /v1/orders:
 *   get:
 *     tags: [Orders]
 *     summary: Get all orders
 *     description: Only accessible by admins. Retrieve a list of all orders.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Error fetching orders
 */

/**
 * @swagger
 * /v1/orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get order by ID
 *     description: Only accessible by admins. Retrieve a specific order by its ID.
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
 *         description: Successfully retrieved the order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       500:
 *         description: Error fetching order
 */

/**
 * @swagger
 * /v1/orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create a new order
 *     description: Only accessible by admins. Create a new order.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Successfully created the order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error creating order
 */

/**
 * @swagger
 * /v1/orders/{id}:
 *   put:
 *     tags: [Orders]
 *     summary: Update an existing order
 *     description: Only accessible by admins. Update a specific order by its ID.
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
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Successfully updated the order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       500:
 *         description: Error updating order
 */

/**
 * @swagger
 * /v1/orders/{id}:
 *   delete:
 *     tags: [Orders]
 *     summary: Delete an order
 *     description: Only accessible by admins. Delete a specific order by its ID.
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
 *         description: Successfully deleted the order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedOrder:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       500:
 *         description: Error deleting order
 */

/**
 * @swagger
 * /v1/orders/me:
 *   post:
 *     tags: [Orders]
 *     summary: Create a new order for the authenticated customer
 *     description: Create a new order for the currently authenticated customer.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Successfully created the order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Error creating order
 */

/**
 * @swagger
 * /v1/orders/me:
 *   get:
 *     tags: [Orders]
 *     summary: Get all orders for the authenticated customer
 *     description: Retrieve a list of all orders for the currently authenticated customer.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved all orders for the customer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Error fetching orders
 */

/**
 * @swagger
 * /v1/orders/me/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get a specific order for the authenticated customer
 *     description: Retrieve a specific order by its ID for the currently authenticated customer.
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
 *         description: Successfully retrieved the order
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       500:
 *         description: Error fetching order
 */

/**
 * @swagger
 * /v1/orders/me/{id}:
 *   put:
 *     tags: [Orders]
 *     summary: Update the shipping address of an order for the authenticated customer
 *     description: Update the shipping address of a specific order by its ID for the currently authenticated customer. Only if the order is not completed.
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
 *             type: object
 *             properties:
 *               shipping_address:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zip:
 *                     type: string
 *                   phone:
 *                     type: string
 *     responses:
 *       200:
 *         description: Successfully updated the shipping address
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       400:
 *         description: Order already completed or invalid input
 *       500:
 *         description: Error updating shipping address
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         customer_id:
 *           type: string
 *         products:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: string
 *               quantity:
 *                 type: integer
 *         total_price:
 *           type: number
 *           format: float
 *         status:
 *           type: string
 *         payment_method:
 *           type: string
 *         shipping_address:
 *           type: object
 *           properties:
 *             address:
 *               type: string
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             zip:
 *               type: string
 *             phone:
 *               type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *       required:
 *         - customer_id
 *         - products
 *         - total_price
 *         - status
 *         - payment_method
 *         - shipping_address
 */

// Admin routes
router.get('/', auth(), roleMiddleware(['admin']), getAllOrders); 
router.get('/:id', auth(), roleMiddleware(['admin']), getOrderById); 
router.post('/', auth(), roleMiddleware(['admin']), createOrder); 
router.put('/:id', auth(), roleMiddleware(['admin']), updateOrder); 
router.delete('/:id', auth(), roleMiddleware(['admin']), deleteOrder); 

// Customer routes
router.post('/me', auth(), createOrder);
router.get('/me', auth(), getAllOrdersForCustomer); 
router.get('/me/:id', auth(), getOrderByIdForCustomer); 
router.put('/me/:id', auth(), updateShippingAddress); 

module.exports = router;
