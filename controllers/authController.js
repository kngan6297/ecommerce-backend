const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/customer');

exports.register = async (req, res) => {
    const { name, email, password, address, phone, username } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    try {
        console.log('JWT_SECRET:', process.env.JWT_SECRET); // Kiểm tra giá trị JWT_SECRET

        // Kiểm tra xem email đã tồn tại chưa
        const existingCustomer = await Customer.findOne({ email });
        if (existingCustomer) {
            console.log('Email already exists:', email);
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Băm mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo khách hàng mới
        const newCustomer = new Customer({
            name,
            email,
            password: hashedPassword,
            address,
            phone,
            username,
            role: 'customer' // Set default role to 'customer'
        });

        await newCustomer.save();
        console.log('New customer created:', newCustomer);

        // Tạo token với thuật toán HS256
        const token = jwt.sign({ id: newCustomer._id, role: newCustomer.role }, process.env.JWT_SECRET, { expiresIn: '1h', algorithm: 'HS256' });
        console.log('Generated token:', token);

        res.status(201).json({ token, customer: newCustomer });
    } catch (error) {
        console.error('Error during registration:', error.message); // Log lỗi khi đăng ký
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('JWT_SECRET:', process.env.JWT_SECRET); // Kiểm tra giá trị JWT_SECRET

        // Tìm khách hàng theo email
        const customer = await Customer.findOne({ email });
        if (!customer) {
            console.log('Customer not found:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, customer.password);
        if (!isMatch) {
            console.log('Password mismatch for customer:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Tạo token với thuật toán HS256
        const token = jwt.sign({ id: customer._id, role: customer.role }, process.env.JWT_SECRET, { expiresIn: '1h', algorithm: 'HS256' });
        console.log('Generated token:', token);

        res.json({ token, customer });
    } catch (error) {
        console.error('Error during login:', error.message); // Log lỗi khi đăng nhập
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
