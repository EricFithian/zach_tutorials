// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please enter a username'],
        unique: true
    },
    firstName: {
        type: String,
        required: [true, 'Please enter your first name']
    }, 
    lastName: {
        type: String,
        required: [true, 'Please enter your last name']
    },
    email: {
        type: String,
        required: [true, 'email cannot be empty'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please provide a password']
    },
    age: {
        type: String,
    },
    profilePicture: {
        type: String,
        default: 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg'
    }
},
    {
        timestamps: true
    }
);

// mongoose.model(<mongodb collection name>, our schema)
const User = mongoose.model('User', userSchema);

module.exports = User;
