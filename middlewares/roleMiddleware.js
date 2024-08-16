const roleMiddleware = (roles) => {
    return async (req, res, next) => {
        try {
            // Log the roles required and the user's role
            console.log('Allowed Roles:', roles);
            console.log('User Role:', req.user?.role);

            // Check if the user's role is included in the allowed roles
            if (!roles.includes(req.user?.role)) {
                console.log('Access Denied: User does not have the required role');
                return res.status(403).json({ message: 'Access denied. You do not have the required role.' });
            }

            next();
        } catch (error) {
            console.error('Error in roleMiddleware:', error.message);
            console.error('Stack Trace:', error.stack);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    };
};

module.exports = roleMiddleware;
