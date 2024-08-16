const express = require('express');
const {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    deleteCustomer
} = require('../controllers/customerController');
const auth = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/roleMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: API for managing customers
 */

/**
 * @swagger
 * /v1/customers:
 *   get:
 *     tags: [Customers]
 *     summary: Get all customers
 *     description: Retrieve a list of all customers. Admin only.
 *     responses:
 *       200:
 *         description: List of customers
 *       403:
 *         description: Access denied. You do not have the required permission.
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /v1/customers/{id}:
 *   get:
 *     tags: [Customers]
 *     summary: Get a customer by ID
 *     description: Retrieve a customer by their ID. Admin only.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Customer ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer information
 *       403:
 *         description: Access denied. You do not have the required permission.
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /v1/customers:
 *   post:
 *     tags: [Customers]
 *     summary: Create a new customer
 *     description: Create a new customer. Admin only.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Customer created successfully
 *       400:
 *         description: Invalid input data
 *       403:
 *         description: Access denied. You do not have the required permission.
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /v1/customers/{id}:
 *   put:
 *     tags: [Customers]
 *     summary: Update a customer
 *     description: Update a customer by their ID. Admin only.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Customer ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       400:
 *         description: Invalid input data
 *       403:
 *         description: Access denied. You do not have the required permission.
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /v1/customers/{id}:
 *   delete:
 *     tags: [Customers]
 *     summary: Delete a customer
 *     description: Delete a customer by their ID. Admin only.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Customer ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *       403:
 *         description: Access denied. You do not have the required permission.
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /v1/customers/me:
 *   get:
 *     tags: [Customers]
 *     summary: Get the current customer's information
 *     description: Retrieve the information of the currently authenticated customer.
 *     responses:
 *       200:
 *         description: Customer information
 *       401:
 *         description: Access denied. No token provided.
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */

/**
 * @swagger
 * /v1/customers/me:
 *   put:
 *     tags: [Customers]
 *     summary: Update the current customer's information
 *     description: Update the information of the currently authenticated customer.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       401:
 *         description: Access denied. No token provided.
 *       500:
 *         description: Internal server error
 *     security:
 *       - bearerAuth: []
 */

// Admin chỉ có thể lấy tất cả khách hàng, tạo, cập nhật, xóa khách hàng
router.get('/', auth('admin'), roleMiddleware(['admin']), getAllCustomers);
router.get('/:id', auth('admin'), roleMiddleware(['admin']), getCustomerById);
router.post('/', auth('admin'), roleMiddleware(['admin']), createCustomer);
router.put('/:id', auth('admin'), roleMiddleware(['admin']), updateCustomer);
router.delete('/:id', auth('admin'), roleMiddleware(['admin']), deleteCustomer);

// Khách hàng có thể lấy thông tin của chính họ và cập nhật thông tin của chính họ
router.get('/me', auth(), (req, res) => {
    const userId = req.user.id;
    getCustomerById(req, res, userId);
});
router.put('/me', auth(), (req, res) => {
    const userId = req.user.id;
    updateCustomer(req, res, userId);
});

module.exports = router;
