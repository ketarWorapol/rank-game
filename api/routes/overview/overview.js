const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const mongo = require('mongodb');


const File = require("../../models/file/file");
const TimeTable = require("../../models/time-table/time-table");
const Research = require("../../models/research/research");
const Evaluation = require("../../models/evaluation/evaluation");
const OnlineLearning = require("../../models/online-learning/online-learning");
const User = require("../../models/user");

router.get("/user", (req, res, next) => {
    User.find({}).count().then(result=> {
        res.status(200).json({
            total: result
        })
    })
})

router.get("/online-learning",  (req, res, next) => {
    OnlineLearning.find({}).count().then(result=> {
        res.status(200).json({
            total: result
        })
    })
});

router.get("/file",  (req, res, next) => {
    File.find({}).count().then(result=> {
        res.status(200).json({
            total: result
        })
    })
});

router.get("/timetable",  (req, res, next) => {
    TimeTable.find({}).count().then(result=> {
        res.status(200).json({
            total: result
        })
    })
});

router.get("/research",  (req, res, next) => {
    Research.find({}).count().then(result=> {
        res.status(200).json({
            total: result
        })
    })
});

router.get("/evaluation",  (req, res, next) => {
    Evaluation.find({}).count().then(result=> {
        res.status(200).json({
            total: result
        })
    })
});

module.exports = router;