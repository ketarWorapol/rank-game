const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Research = require('../../models/research/research');

router.get("/", (req, res, next) => {
    Research.find()
        .then(item=> {
            const totalItem= item.length;
            res.status(200).json({
                totalItem: totalItem,
                items: item
            })
        })
})

router.get("/:id", (req, res, next) => {
    const id = req.params.id;
    Research.find({
        user: id
    })
    .sort({
        observe_date: -1
    })
    .then(item => {
        const totalItem = item.length;
        res.status(200).json({
            totalItem: totalItem,
            items: item
        })
    })
})

router.post("/", (req, res, next) => {
    const research = new Research({
        _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        chapter: req.body.chapter,
        date: new Date,
        user: req.body.user,
        status: req.body.status,
        url: req.body.url
    })

    research
        .save()
        .then(result => {
            res.status(201).json({
                message: "Research is posted",
                item: result
            })
        })
        .catch(err => {
            res.status(500).json({
                message: err.name,
                error: err
            })
        })
})

router.patch("/:_id", (req, res, next)=> {
    const _id = req.params._id;
    Research.update({
        _id: _id
    }, {
        status: req.body.status
    })
    .exec()
    .then(result=>{
        res.status(200).json({
            message: "Research is Updated",
            response: result
        })
    })  
})

router.delete("/:_id", (req, res, next) => {
    const _id = req.params._id;
    Research.remove({
        _id:_id
    })
    .exec()
    .then(
        res.status(200).json({
            message: 'Research is deleted'
        })
    )
})

module.exports = router;