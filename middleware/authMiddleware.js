// authMiddleware.js
const User = require("../models/User");
// Middleware to protect routes that require authentication
const isAuthenticated = async (req, res, next) => {
    // Check if user is authenticated by verifying JWT token
    if (req.session && req.session.userId) {
        try {
            const user = await User.findById(req.session.userId);

            if (user && user.role === 'admin') {
                return next();
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }
    res.redirect('/auth/login');
}

module.exports = isAuthenticated;
