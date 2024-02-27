const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// User Schema
const sneakerSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 255
    },
    title: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 1024
    },
    price: {
        type: String,
        required: true,
        minlength: 0,
        maxlength: 1024
    },
}, {timestamps: true});


const Sneaker = mongoose.model('Sneaker', sneakerSchema);

module.exports = Sneaker;
