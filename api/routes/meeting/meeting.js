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

router.delete("/:_id", (req, res, next)=>{
    var _id = req.params._id
    Meeting.deleteOne({
        _id: _id
    })
    .then(result=>{
        res.status(200).json({
            message:"ลบข้อมูลสำเร็จ !",
        })
    }).catch(err=>{
        res.status(500).json({
            message:"ลบข้อมูลเกิดการผิดพลาด",
            err:err.name
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

module.exports = router;