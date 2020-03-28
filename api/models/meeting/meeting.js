const mongoose = require('mongoose');

const meetingSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },

    url: {
        type: String,
    },

    date: {
        type: Date,
        default: Date
    },
    message: {
        type: String,
    }

});



const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;