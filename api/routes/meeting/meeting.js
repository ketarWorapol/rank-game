const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const request = require('request');

const Meeting = require('../../models/meeting/meeting');



router.post("/", (req, res, next) => {
    const meeting = new Meeting({
        _id: mongoose.Types.ObjectId(),
        date: req.body.date,
        user: req.body.user,
        message: req.body.message,
        teacher_name: req.body.teacher_name,
        url: req.body.url,
    })

    meeting
        .save()
        .then(result => {
            res.status(200).json({
                message_from_backend: "Meeting is Created",
                item: result
            })
        })
        .catch(err => {
            res.status.json({
                message: err
            })
        })
})

// หารายละเอียดการสังเกตการสอน
router.get("/", (req, res, next) => {

    Meeting.find()
        .populate('user', 'firstname lastname')
        .limit(5)
        .sort({
            date: -1
        })
        .then(result => {
            res.status(200).json({
                total_items: result.length,
                item: result,
            })
        })

});

router.get("/google", (req, res, next) => {
    var input = "วิทยาลัยอาชีวศึกษานครปฐม"
    var url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + input + '&key=AIzaSyAKpIWnvRRq-qnpX7XfXKpg9Vq_DYKSl74&sessiontoken=1234567890&language=th'
    request.get(url)
        .then(result=>{
            res.status(200).json({
                message: "Hello",
                result
            })
        })
});


module.exports = router;