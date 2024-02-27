const express = require('express');
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const User = require('../models/User');
const Sneaker = require('../models/Sneaker');
const bcrypt = require("bcrypt");

const router = express.Router();

// Middleware for admin authorization

// Admin page route
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const items = await Sneaker.find();
        const lang = req.query.lang || 'en';

        res.render('admin/index', { items, lang: lang });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Create a new item
router.post('/sneaker', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { pictures, names, descriptions } = req.body;
        const item = new Sneaker({ pictures, names, descriptions });
        await item.save();
        res.redirect('/admin'); // Redirect to the admin page after adding an item
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// Get a specific item by ID
router.get('/sneaker/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const itemId = req.params.id;

        // Check if the provided ID is for adding a new item
        if (itemId === 'add') {
            // Handle the case for adding a new item (redirect to the add item page or any other appropriate action)
            return res.redirect('/admin/sneaker/add');
        }

        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).send('Invalid item ID');
        }

        const item = await Sneaker.findById(itemId);

        if (item) {
            res.json(item);
        } else {
            res.status(404).send('Sneaker not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


// Delete a specific item by ID
router.delete('/sneaker/:id/delete', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const itemId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).send('Invalid item ID');
        }

        const deletedSneaker = await Sneaker.findByIdAndDelete(itemId);

        if (deletedSneaker) {
            // Redirect back to the admin page after successful deletion
            res.redirect('/admin');
        } else {
            res.status(404).send('Sneaker not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
router.put('/sneaker/:id/edit', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const itemId = req.params.id;
        const { pictures, names, descriptions } = req.body;

        if (!mongoose.Types.ObjectId.isValid(itemId)) {
            return res.status(400).send('Invalid item ID');
        }

        const updatedSneaker = await Sneaker.findByIdAndUpdate(
            itemId,
            { pictures, names, descriptions },
            { new: true }
        );

        if (updatedSneaker) {
            res.redirect('/admin');
        } else {
            res.status(404).send('Sneaker not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


// Admin page route for users
router.get('/users', adminMiddleware, async (req, res, next) => {
    try {
        // Fetch all users from the database
        const users = await User.find();
        const lang = req.query.lang || 'en';

        // Send the users as a JSON response
        res.render('admin/user/index', { users, lang: lang });
    } catch (error) {
        // If an error occurs, pass it to the error handling middleware
        next(error);
    }
})
router.get('/user/create', adminMiddleware, async (req, res, next) => {
    try {
        const lang = req.query.lang || 'en';
        res.render('admin/user/create', { lang });
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    }
});
router.post('/user/create', adminMiddleware, async (req, res, next) => {
    try {
        const { username, password, role } = req.body;
        const user = new User({ username, password, role });
        await user.save();
        res.redirect('/admin/users');
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).send('An error occurred during user registration');
    }
});
router.get('/user/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Find the user by ID
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ message: 'An error occurred while fetching user' });
    }
});

router.get('/user/:id/edit', async (req, res, next) => {
    try {
        const lang = req.query.lang || 'en';
        const userId = req.params.id;

        const user = await User.findById(userId)
        console.log(userId)
        res.render('admin/user/edit', { user, lang: lang });
    } catch (error) {
        next(error)
    }
})

router.put('/user/:id/edit', async (req, res) => {
    try {
        const userId = req.params.id;
        const { username, role } = req.body;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).send('Invalid user ID');
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { username, role },
            { new: true }
        );

        if (updatedUser) {
            res.redirect('/admin/users'); // Redirect back to the admin users page after successful update
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'An error occurred while updating user' });
    }
});

router.delete('/user/:id/delete', async (req, res) => {
    const { id } = req.params;

    try {
        // Find the user by ID and delete
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'An error occurred while deleting user' });
    }
});



module.exports = router;