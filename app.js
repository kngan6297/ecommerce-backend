const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const routes = require('./routes/index');
const swaggerSetup = require('./swagger');

dotenv.config();

const app = express(); 
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Thiết lập Swagger
swaggerSetup(app); 

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Middleware kiểm tra xác thực
app.use('/api', routes); 

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
