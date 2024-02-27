const mongoose = require('mongoose');

const userDetails = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    actionDetails: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const UserDetails = mongoose.model('UserDetails', userDetails);

module.exports = UserDetails;