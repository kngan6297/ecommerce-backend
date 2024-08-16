const Customer = require('../models/customer');
const bcrypt = require('bcrypt');

exports.getAllCustomers = async (req, res) => {
    try {
        console.log('Fetching all customers...');
        const customers = await Customer.find();
        console.log('Customers fetched successfully');
        res.json(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
        if (error.code === 'ECONNRESET') {
            console.error('Connection was reset. Please check your network and database server.');
        }
        res.status(500).json({ message: 'Error fetching customers', error: error.message });
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        console.log(`Fetching customer with ID: ${req.params.id}`);
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            console.log('Customer not found');
            return res.status(404).json({ message: 'Customer not found' });
        }
        console.log('Customer fetched successfully');
        res.json(customer);
    } catch (error) {
        console.error('Error fetching customer:', error);
        if (error.code === 'ECONNRESET') {
            console.error('Connection was reset. Please check your network and database server.');
        }
        res.status(500).json({ message: 'Error fetching customer', error: error.message });
    }
};

exports.createCustomer = async (req, res) => {
    const { name, email, password, address, phone, username, date_of_birth } = req.body;

    if (!name || !email || !password || !username) {
        return res.status(400).json({ message: 'Name, email, password, and username are required' });
    }

    try {
        console.log(`Creating customer with email: ${email} and username: ${username}`);
        const existingCustomer = await Customer.findOne({ $or: [{ email }, { username }] });
        if (existingCustomer) {
            const message = existingCustomer.email === email ? 'Email already exists' : 'Username already exists';
            console.log(message);
            return res.status(400).json({ message });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newCustomer = new Customer({
            name,
            email,
            password: hashedPassword,
            address,
            phone,
            username,
            date_of_birth
        });

        await newCustomer.save();
        console.log('Customer created successfully');
        res.status(201).json(newCustomer);
    } catch (error) {
        console.error('Error creating customer:', error);
        res.status(500).json({ message: 'Error creating customer', error: error.message });
    }
};

exports.updateCustomer = async (req, res) => {
    const { name, email, password, address, phone, username, date_of_birth } = req.body;

    if (!name && !email && !password && !address && !phone && !username && !date_of_birth) {
        return res.status(400).json({ message: 'At least one field is required to update' });
    }

    try {
        console.log(`Updating customer with ID: ${req.params.id}`);
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            console.log('Customer not found');
            return res.status(404).json({ message: 'Customer not found' });
        }

        if (email && email !== customer.email) {
            const existingCustomerByEmail = await Customer.findOne({ email });
            if (existingCustomerByEmail) return res.status(400).json({ message: 'Email already exists' });
        }

        if (username && username !== customer.username) {
            const existingCustomerByUsername = await Customer.findOne({ username });
            if (existingCustomerByUsername) return res.status(400).json({ message: 'Username already exists' });
        }

        customer.name = name || customer.name;
        customer.email = email || customer.email;
        if (password) {
            customer.password = await bcrypt.hash(password, 10);
        }
        customer.address = address || customer.address;
        customer.phone = phone || customer.phone;
        customer.username = username || customer.username;
        customer.date_of_birth = date_of_birth || customer.date_of_birth;

        await customer.save();
        console.log('Customer updated successfully');
        res.json(customer);
    } catch (error) {
        console.error('Error updating customer:', error);
        res.status(500).json({ message: 'Error updating customer', error: error.message });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        console.log(`Deleting customer with ID: ${req.params.id}`);
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            console.log('Customer not found');
            return res.status(404).json({ message: 'Customer not found' });
        }

        await customer.remove();
        console.log('Customer deleted successfully');
        res.json({ message: 'Customer deleted successfully', deletedCustomer: customer });
    } catch (error) {
        console.error('Error deleting customer:', error);
        res.status(500).json({ message: 'Error deleting customer', error: error.message });
    }
};
