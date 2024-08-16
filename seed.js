const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Category = require('./models/category');
const Product = require('./models/product');
const Customer = require('./models/customer');
const Order = require('./models/order');

// Danh sách các categories
const categories = [
    { name: 'Nendoroid', description: 'Chibi figures with interchangeable parts and accessories.' },
    { name: 'Scale Figures', description: 'Figures with a specific scale, representing characters from various series.' },
    { name: 'Figma', description: 'Highly articulated figures known for their poseability and detailed accessories.' },
    { name: 'Pop Up Parade', description: 'Affordable, high-quality figures with great detail.' },
    { name: 'Model Kits', description: 'Unassembled model kits for building detailed replicas.' },
    { name: 'S.H.Figuarts', description: 'Figures known for their excellent articulation and detail.' },
    { name: 'Metal Build', description: 'Figures made with a combination of metal and plastic parts for added durability and detail.' },
    { name: 'FiguartsZERO', description: 'High-quality, non-articulated figures with great detail.' },
    { name: 'Proplica', description: 'Replica props from popular series, often with special features.' },
    { name: 'DX', description: 'Deluxe versions of figures or toys with extra features and accessories.' },
];

// Tạo dữ liệu mẫu cho products
const generateProducts = (categories) => {
    const products = [];
    const materials = ['PVC', 'ABS', 'Resin'];
    const scales = ['1/4', '1/6', '1/7', 'non scale'];

    for (let i = 1; i <= 100; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const productScale = scales[Math.floor(Math.random() * scales.length)];
        const basePrice = Math.floor(Math.random() * 100) + 10;
        const price = productScale === '1/4' ? basePrice * 1.5 :
                      productScale === '1/6' ? basePrice * 1.3 :
                      productScale === '1/7' ? basePrice * 1.2 : basePrice;

        products.push({
            name: `Product ${i}`,
            description: `Description for product ${i}`,
            price: price,
            category_id: category._id,
            images: Array.from({ length: 5 }, (_, index) => `image${i}_part${index + 1}.jpg`),
            brand: `Brand ${Math.floor(Math.random() * 10) + 1}`,
            material: materials[Math.floor(Math.random() * materials.length)], // Chỉ chọn 1 material
            scale: productScale,
            release_date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)),
        });
    }
    return products;
};

// Tạo dữ liệu mẫu cho customers
const generateCustomers = async () => {
    const customers = [];
    // Tạo 1 admin
    const adminPasswordHash = await bcrypt.hash('adminPassword', 10);
    customers.push({
        name: 'Admin User',
        email: 'admin@example.com',
        password: adminPasswordHash,
        address: 'Admin Address',
        phone: '123-456-7890',
        username: 'adminUser',
        date_of_birth: new Date(1985, 0, 1),
        role: 'admin', // Vai trò admin
    });

    // Tạo 50 khách hàng
    for (let i = 1; i <= 50; i++) {
        const passwordHash = await bcrypt.hash(`password${i}`, 10);
        customers.push({
            name: `Customer ${i}`,
            email: `customer${i}@example.com`,
            password: passwordHash,
            address: `Address ${i}`,
            phone: `123-456-789${i}`,
            username: `username${i}`,
            date_of_birth: new Date(1990 + i % 10, i % 12, i % 28),
            role: 'customer', // Vai trò customer
        });
    }
    return customers;
};

// Tạo dữ liệu mẫu cho orders
const generateOrders = (customers, products) => {
    const orders = [];
    for (let i = 1; i <= 50; i++) {
        const customer = customers[Math.floor(Math.random() * customers.length)];
        const orderProducts = [];
        for (let j = 0; j < Math.floor(Math.random() * 5) + 1; j++) {
            const product = products[Math.floor(Math.random() * products.length)];
            orderProducts.push({ product_id: product._id, quantity: Math.floor(Math.random() * 3) + 1 });
        }
        const total_price = orderProducts.reduce((total, item) => {
            const product = products.find(p => p._id.equals(item.product_id));
            return total + (product ? item.quantity * product.price : 0);
        }, 0);

        orders.push({
            customer_id: customer._id,
            products: orderProducts,
            total_price,
            status: ['Pending', 'Shipped', 'Delivered', 'Cancelled'][Math.floor(Math.random() * 4)],
            payment_method: ['Credit Card', 'PayPal', 'Bank Transfer'][Math.floor(Math.random() * 3)],
            shipping_address: {
                street: customer.address.split(',')[0] || 'Street',
                city: customer.address.split(',')[1] || 'City',
                postal_code: customer.address.split(',')[2] || 'Postal Code',
                country: customer.address.split(',')[3] || 'Country',
                phone: customer.phone,
            },
        });
    }
    return orders;
};

// Seed dữ liệu vào MongoDB
const seedDatabase = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/TOKUani', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Xóa các dữ liệu hiện có
        await Category.deleteMany({});
        await Product.deleteMany({});
        await Customer.deleteMany({});
        await Order.deleteMany({});

        // Thêm các categories
        const savedCategories = await Category.insertMany(categories);

        // Thêm các products
        const products = generateProducts(savedCategories);
        const savedProducts = await Product.insertMany(products);

        // Thêm các customers
        const customers = await generateCustomers();
        const savedCustomers = await Customer.insertMany(customers);

        // Thêm các orders
        const orders = generateOrders(savedCustomers, savedProducts);
        await Order.insertMany(orders);

        console.log('Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error.message);
    } finally {
        mongoose.disconnect();
    }
};

// Thực thi hàm seed
seedDatabase();
