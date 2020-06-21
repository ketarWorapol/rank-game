const mongoose = require('mongoose');

const researchSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    chapter : {
        type: Number
    },
    date: Date,
    detail:String,
    user:String,
    status: Number,
    url: String
})

const Research = mongoose.model('research', researchSchema);
module.exports = Research;