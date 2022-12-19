// models/Product.js

const mongoose = require('mongoose');

const tutorialSchema = new mongoose.Schema({
    thumbnail: {
        type: String,
    },
    upload_image: {
        data: Buffer,
        contentType: String
    },
    title: {
        type: String,
        required: [true, 'title cannot be empty!']
    },
    header: {
        type: String,
    },
    body: {
        type: String,
        required: [true, 'body cannot be empty!']
    },
    link: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
},
    {
        timestamps: true
    }
);

// mongoose.model(<mongodb collection name>, our schema)
const Tutorial = mongoose.model('Tutorial', tutorialSchema);

module.exports = Tutorial;
