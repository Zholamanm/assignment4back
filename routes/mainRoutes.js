// mainRoutes.js
const express = require('express');
const router = express.Router();
const Sneaker = require('../models/Sneaker'); // Import the Item model
const userMiddleware = require('../middleware/userMiddleware');


router.get('/', userMiddleware, async (req, res) => {
    try {
        const sneakers = await Sneaker.find().sort({ createdAt: -1 }); // Fetch sneakers from the database
        const lang = req.query.lang || 'en';
        res.render('client/index', { sneakers, lang, userId: req.session.userId, user: req.user }); // Pass sneakers to the index page
    } catch (error) {
        console.error(error);
        res.status(500).json({ errorMessage: 'Error fetching items' });
    }
});

module.exports = router;
