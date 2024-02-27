const User = require("../models/User");
const isAuthenticatedUser = async (req, res, next) => {
    if (req.session && req.session.userId) {
        try {
            const user = await User.findById(req.session.userId);

            if (user) {
                req.user = user; // Add the user object to the request for further use in routes
                return next();
            }
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
    }

    res.redirect('/auth/login');
}

module.exports = isAuthenticatedUser;