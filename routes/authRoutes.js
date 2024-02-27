const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

router.get('/register', (req, res) => {
    res.render('client/auth/register', {pageTitle: 'Register', lang: req.session.lang}); // Assuming lang is stored in the session
});

router.post('/register', async (req, res) => {
    try {
        const {username, password} = req.body;
        let existingUser = await User.findOne({username});
        if (existingUser) {
            return res.status(400).send('User already exists');
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            username,
            password: hashedPassword,
        });

        // Save the user to the database
        await user.save();

        // Redirect to the login page after successful registration
        res.redirect('/auth/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

// POST /login - User login

router.get('/login', (req, res) => {
    res.render('client/auth/login', {pageTitle: 'Login', lang: req.session.lang || 'en'});
})

router.post('/login', async (req, res) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({username});

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            console.log('Does not compares correctly')
            return res.status(400).send('Invalid username or password');
        }
        if (user.isDeleted()) {
            return res.status(403).send('This account has been deleted.');
        }

        req.session.userId = user._id;

        req.session.isAuthenticated = true;
        req.session.lang = req.body.lang || 'en';
        res.redirect('/');

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/login/admin', (req, res) => {
    res.render('admin/auth/login', {pageTitle: 'Login Admin', lang: req.session.lang || 'en'});
})
// POST /login/admin - Admin login
router.post('/login/admin', async (req, res) => {
    try {
        const {username, password} = req.body;

        const user = await User.findOne({username});

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            console.log('Does not compares correctly')
            return res.status(400).send('Invalid username or password');
        }
        if (user.role !== 'admin') {
            return res.status(403).send('You are not an admin');
        }
        if (user.isDeleted()) {
            return res.status(403).send('This account has been deleted.');
        }

        req.session.userId = user._id;

        req.session.isAuthenticated = true;
        req.session.lang = req.body.lang || 'en';
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

router.get('/logout', (req, res) => {
    // Очищаем userId из объекта сессии
    req.session.userId = undefined; // или delete req.session.userId;

    // Уничтожаем сессию
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;
