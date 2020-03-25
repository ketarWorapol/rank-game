const mongoose = require('mongoose');

const TimeTableSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    term: Number,
    url: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
})

const TimeTable = mongoose.model('time-table', TimeTableSchema);
module.exports = TimeTable;