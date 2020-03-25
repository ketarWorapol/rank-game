const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const mongo = require('mongodb');


const TimeTable = require("../../models/time-table/time-table");

router.get("/:_id",  (req, res, next) => {
    const _id = req.params._id;
    TimeTable.find({
        user: _id
    })
    .populate('user', 'firstname lastname email')
    .sort({
        date: -1
    })
    .then(item => {
        const totalItem = item.length;

        res.status(200).json({
            totalItems: totalItem,
            items: item
        })
    })
    .catch(err => {
        res.status(500).json({
            message: err.name,
            error: err
        })
    })
});

router.delete("/:_id", (req, res, next)=> {
    const _id = req.params._id;
    OnlineLearning
        .remove({
            _id: _id
        })
        .exec()
        .then(
            res.status(200).json({
                message: "Online-learning is deleted"
            })
        )
        .catch(err => {
            res.status(200).json({
                message: err.name,
                error: err
            })
        })
})

router.post("/", (req, res, next) => {
  const time_table = new TimeTable({
      _id: new mongoose.Types.ObjectId(),
      term: req.body.term,
      url: req.body.url,
      user: req.body.user
  })

  time_table.save()
    .then(result => {
        res.status(201).json({
            message:"Created Online-Learning is successfully",
            Created: {
                _id: result._id,
                term: result.term,
                url: result.url,
                user: result.user,
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error : err
        });
    })
});


module.exports = router;