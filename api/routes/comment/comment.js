const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Comment = require('../../models/comment/comment');

// test call get
router.get("/", (req, res, next) => {
    res.status(201).json({
        message: "GET ALL Comments is working"
    })
});

// get comment in observe
router.get("/:refId", (req, res, next) => {
    const refId = req.params.refId;

    Comment.find({
            ref: refId
        })
        .populate('user', 'firstname lastname email image position')
        .sort({
            date: 0 //เรียงตามวันที่ล่าสุด
        })
        .then(item => {
            const totalItem = item.length;
            res.status(200).json({
                totalItems: totalItem,
                items: item
            });
            //console.log(item);
        }).catch(err => {
            res.status(500).json({
                message: err.name,
                error: err
            })
        });
})

// delete comment by commentId
router.delete("/:commentId", (req, res, next) => {
    const _id = req.params.commentId;
    Comment
        .remove({
            _id: _id
        })
        .exec()
        .then(
            res.status(200).json({
                message: "Comment is deleted"
            })
        )
        .catch(err => {
            res.status(200).json({
                message: err.name,
                error: err
            })
        })
})

// deleye by observe || Delete by REF
router.delete("/bycomment/:ref", (req, res, next) => {
    const ref = req.params.ref;
    Comment.remove({
            ref: ref
        })
        .exec()
        .then(
            res.status(200).json({
                message: "Deleted Comment by REF "
            })
        )
        .catch(err => {
            res.status(200).json({
                message: err.name,
                error: err
            })
        })
})

// post Comment
router.post("/", (req, res, next) => {
    const comment = new Comment({
        _id: mongoose.Types.ObjectId(),
        date: req.body.date,
        ref: req.body.ref,
        user: req.body.user,
        comment: req.body.comment
    })

    comment
        .save()
        .then(result => {
            res.status(201).json({
                _id: result._id,
                date: result.date,
                ref: result.ref,
                user: result.user,
                comment: result.comment
            })
        }).catch(err => {
            res.status(500).json({
                message: err.name,
                error: err
            })
        })
})

module.exports = router;