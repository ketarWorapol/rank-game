const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Evaluation = require('../../models/evaluation/evaluation');

// ดูการประเมินตาม _id
router.get("/:_id", (req, res, next) => {
    const refId = req.params._id;
    Evaluation.find({
        user: refId
    })
        .populate('user', 'firstname lastname email')
        .sort({
            date:-1 //เรียงตามวันที่ล่าสุด
        })
        .then(item=>{
            const totalItem = item.length;
            
            // console.log(item)
            res.status(200).json({
                totalItems : totalItem,
                items: item
            });
        }).catch(err => {
            res.status(500).json({
                message: err.name,
                error: err
            })
        })
})

// เพิ่มการประเมิน
router.post("/", (req, res, next) => {
    const evaluation = new Evaluation({
        _id: mongoose.Types.ObjectId(),
        date: req.body.date,
        evaluation: req.body.evaluation,
        user: req.body.user
    })

    evaluation
        .save()
        .then(result => {
            res.status(201).json({
                _id: result._id,
                date: result.date,
                evaluation: result.evaluation,
                user: result.user,
            })
        }).catch(err => {
            res.status(500).json({
                message: err.name,
                error: err
            })
        })
})

module.exports = router;