const mongoose = require('mongoose');

const OnlineLearningSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: Date,
    course: String,
    title: String,
    url: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
})

const OnlineLearning = mongoose.model('online-learning', OnlineLearningSchema);
module.exports = OnlineLearning;