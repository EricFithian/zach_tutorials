// models/Product.js

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    stars: {
        type: Number,
        required: [true, 'Stars cannot be empty :('],
        min: 1,
        max: 5
    },
    comment: {
        type: String,
    },
    name: {
        type: String,
        required: [true, 'People on the internet who leave annonymous reviews are meanies']
    },
    tutorial: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tutorial"
    }],
},
    {
        timestamps: true
    }
);

// mongoose.model(<mongodb collection name>, our schema)
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;