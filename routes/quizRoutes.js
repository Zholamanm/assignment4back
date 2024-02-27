const express = require('express');
const router = express.Router();
const userMiddleware = require('../middleware/userMiddleware');
const User = require('../models/User');
const UserScore = require('../models/UserScore');

// GET route for rendering the quiz page
router.get('/', userMiddleware, (req, res) => {
    res.render('client/quiz/index');
});

// POST route for handling quiz submission
router.post('/submit', userMiddleware, async (req, res) => {
    try {
        const { userId, username } = req.body;
        const userAnswers = req.body;

        // Define the correct answers
        const correctAnswers = {
            q1: 'a',
            q2: 'a',
            q3: 'b',
            q4: 'c',
        };

        // Calculate the score
        let score = 0;
        for (const question in correctAnswers) {
            if (userAnswers[question] && userAnswers[question].toLowerCase() === correctAnswers[question].toLowerCase()) {
                score++;
            }
        }

        // Save user result to the database
        const userScore = await UserScore.findOneAndUpdate(
            { userId },
            { $inc: { totalScore: score } },
            { upsert: true, new: true }
        );

        // Optionally, update user's total score in the User model
        // await User.findByIdAndUpdate(userId, { $inc: { totalScore: score } });

        // Render the result page with information about the score
        res.render('client/quiz/result', { score, totalQuestions: Object.keys(correctAnswers).length, userScore, username });
    } catch (error) {
        console.error('Error saving user result:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;