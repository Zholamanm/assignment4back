const User = require("../models/User");
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.session.userId);


        if (user && user.role === 'admin') {
            return next();
        } else {
            res.status(403).send('Forbidden - Admin access required');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = isAdmin;