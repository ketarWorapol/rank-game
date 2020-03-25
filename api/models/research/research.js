const mongoose = require('mongoose');

const researchSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    chapter : {
        type: Number
    },
    date: Date,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    status: Number,
    url: String
})

const Research = mongoose.model('research', researchSchema);
module.exports = Research;