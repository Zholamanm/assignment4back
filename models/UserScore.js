const mongoose = require('mongoose');

const userScoreSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    totalScore: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const UserScore = mongoose.model('UserScore', userScoreSchema);

module.exports = UserScore;