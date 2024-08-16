const jwt = require('jsonwebtoken');

const auth = (requiredRole) => {
    return async (req, res, next) => {
        try {
            console.log('JWT_SECRET:', process.env.JWT_SECRET); // Kiểm tra giá trị của JWT_SECRET
            console.log('Authorization Header:', req.header('Authorization'));
            const token = req.header('Authorization')?.split(' ')[1];
            console.log('Extracted Token:', token);

            if (!token) {
                console.log('No token provided');
                return res.status(401).json({ message: 'Access denied. No token provided.' });
            }

            // Verify token and decode it
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    console.error('Error verifying token:', err.message);
                    return res.status(401).json({ message: 'Invalid token.' });
                }

                console.log('Decoded JWT:', decoded);
                req.user = decoded;

                if (requiredRole && req.user.role !== requiredRole) {
                    console.log(`Access Denied: User role ${req.user.role} does not match required role ${requiredRole}`);
                    return res.status(403).json({ message: 'Access denied. You do not have the required permission.' });
                }

                next(); // Continue to the next middleware or route handler
            });

        } catch (error) {
            console.error('Error in auth middleware:', error.message);
            console.error('Stack Trace:', error.stack);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    };
};

module.exports = auth;
