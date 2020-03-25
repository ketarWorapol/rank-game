const mongoose = require('mongoose');

const evaluation_schema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    date: Date,
    evaluation: Array,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    }
})

const evaluation = mongoose.model('evaluation', evaluation_schema);
module.exports = evaluation;