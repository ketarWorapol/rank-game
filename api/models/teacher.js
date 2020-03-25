const mongoose = require('mongoose');

const teacherSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    coordinator_name: { type: String, require: true },
    tel: { type: String, require: true }
})

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher