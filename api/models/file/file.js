const mongoose = require('mongoose');

const fileSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String
    },
    type: {
        type: String
    },
    size: {
        type: Number
    },
    url: {
        type: String
    }
});

const File = mongoose.model('File', fileSchema);

module.exports = File