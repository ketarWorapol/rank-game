const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const OnlineLearning = require("../../models/online-learning/online-learning");

router.get("/:_id",  (req, res, next) => {
    const _id = req.params._id;
    OnlineLearning.find({
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
  const olearning = new OnlineLearning({
      _id: new mongoose.Types.ObjectId(),
      date: req.body.date,
      course: req.body.course,
      title: req.body.title,
      detail: req.body.detail,
      user: req.body.user
  })

  olearning.save()
    .then(result => {
        res.status(201).json({
            message:"Created Online-Learning is successfully",
            Created: {
                _id: result._id,
                date: result.date,
                course: result.course,
                title: result.title,
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