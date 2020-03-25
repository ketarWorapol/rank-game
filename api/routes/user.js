const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/user');

// GET ALL USER
router.get('/', (req, res, next) => {
    var keyData = Object.keys(req.query)[0];
  var valueData = Object.values(req.query)[0];

  if (!req.query.email) {
    console.log("Tell me what you feel")
    req.query.email = "";
    // return;
  }

  var startPage = Object.values(req.query)[1] - 1;
  var limitPage = Object.values(req.query)[2];
  var skip = startPage * limitPage;
  // console.log(req.query.length)
  // console.log(startPage)

  try{
    // กรณี Search
  if ((flag == 1 && dummy == 1)) {
    const temp = User
      .find({
        [keyData]: {
          '$regex': valueData
        }
      })
      .populate('academy')

    temp.then(items => {
        const totalItem = items.length;
        temp
          .skip(Number(skip))
          .limit(Number(limitPage))
          .then(item => {
            return res.status(200).json({
              totalItems: totalItem,
              items: item
            });
          })
      })
      .catch(err => {
        res.status(500).json({
          message: err.name
        })
      })
  } else { // กรณียังไม่ได้ Search
    dummy = 1;
    User
      .find()
      .exec()
      .then(items => {
        const totalItem = items.length;
        User
          .find()
          .populate('academy')
          .skip(0)
          .limit(Number(limitPage))
          .then(item => {
            return res.status(200).json({
              totalItems: totalItem,
              items: item
            });
          })

      })
      .catch(err => {
        res.status(500).json({
          message: err.name
        })
      })
  }
  }catch{
    User.find()
    .then(item=>{
      return res.status(200).json({
        item
      })
    })
  }
})
module.exports = router;