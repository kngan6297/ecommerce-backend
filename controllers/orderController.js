const Order = require('../models/order');
const Customer = require('../models/customer');
const Product = require('../models/product');

exports.getAllOrders = async (req, res) => {
    console.log('getAllOrders called');
    try {
        const orders = await Order.find()
            .populate('customer_id', 'name email')
            .populate('products.product_id', 'name price');
        console.log('Orders retrieved:', orders);
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error.message);
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('customer_id', 'name email')
            .populate('products.product_id', 'name price');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order', error: error.message });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { customer_id, products, total_price, status, payment_method, shipping_address } = req.body;

        // Kiểm tra khách hàng có tồn tại không
        const customer = await Customer.findById(customer_id);
        if (!customer) return res.status(400).json({ message: 'Customer does not exist' });

        // Kiểm tra sản phẩm có tồn tại không
        for (const item of products) {
            const product = await Product.findById(item.product_id);
            if (!product) return res.status(400).json({ message: `Product with id ${item.product_id} does not exist` });
        }

        const newOrder = new Order({
            customer_id,
            products,
            total_price,
            status,
            payment_method,
            shipping_address,
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const { phone, shipping_address } = req.body;

        // Kiểm tra đơn hàng có tồn tại không
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        // Kiểm tra quyền truy cập: chỉ cho phép chỉnh sửa nếu người dùng là chủ đơn hàng
        if (order.customer_id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied. You can only update your own order.' });
        }

        // Chỉ cho phép cập nhật số điện thoại và địa chỉ nhận hàng
        if (phone) {
            order.shipping_address.phone = phone;
        }

        if (shipping_address) {
            order.shipping_address = {
                ...order.shipping_address,
                ...shipping_address,
            };
        }

        order.updated_at = Date.now();

        await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error updating order', error: error.message });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Order not found' });

        await order.remove();
        res.json({ message: 'Order deleted successfully', deletedOrder: order });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting order', error: error.message });
    }
};

// Xử lý để lấy tất cả đơn hàng của khách hàng
exports.getAllOrdersForCustomer = async (req, res, userId) => {
    try {
        const orders = await Order.find({ customer_id: userId })
            .populate('customer_id', 'name email') // Chỉ lấy name và email của khách hàng
            .populate('products.product_id', 'name price'); // Chỉ lấy name và price của sản phẩm
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customer orders', error: error.message });
    }
};

// Xử lý để lấy đơn hàng của khách hàng theo ID
exports.getOrderByIdForCustomer = async (req, res, userId, orderId) => {
    try {
        const order = await Order.findOne({ _id: orderId, customer_id: userId })
            .populate('customer_id', 'name email')
            .populate('products.product_id', 'name price');
        if (!order) return res.status(404).json({ message: 'Order not found or access denied' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customer order', error: error.message });
    }
};

// Xử lý để cập nhật địa chỉ giao hàng nếu đơn hàng chưa hoàn thành
exports.updateShippingAddress = async (req, res, userId, orderId, shipping_address) => {
    try {
        const order = await Order.findOne({ _id: orderId, customer_id: userId });
        if (!order) return res.status(404).json({ message: 'Order not found or access denied' });

        if (order.status === 'completed') {
            return res.status(400).json({ message: 'Cannot update shipping address for completed orders' });
        }

        order.shipping_address = {
            ...order.shipping_address,
            ...shipping_address,
        };

        order.updated_at = Date.now();

        await order.save();
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error updating shipping address', error: error.message });
    }
};
