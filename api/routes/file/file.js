const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const File = require('../../models/file/file');

// เพิ่มไฟล์ลงในฐานข้อมูล
router.post("/", (req, res, next) => {
  const file = new File({
    _id: mongoose.Types.ObjectId(),
    user: req.body.user,
    url: req.body.url,
    size: req.body.size,
    type: req.body.type,
    name: req.body.name
  })

  file
    .save()
    .then(result => {
      res.status(201).json({
        _id: result._id,
        user: result.user,
        url: result.url
      })
    }).catch(err => {
      res.status(500).json({
        message: err.name,
        error: err
      })
    })
})

// ค้นหาไฟล์จากฐานข้อมูลทั้งหมด
router.get("/", (req, res, next) => {
  // มีการค้นหา
  if (Object.keys(req.query).length == 3) {
    var keyData = Object.keys(req.query)[0];
    var valueData = Object.values(req.query)[0];


    var startPage = Object.values(req.query)[1] - 1;
    var limitPage = Object.values(req.query)[2];
    var skip = startPage * limitPage;
  } else if(Object.keys(req.query).length==3) { //ไม่มีการค้นหา
    var startPage = Object.values(req.query)[0] - 1;
    var limitPage = Object.values(req.query)[1];
    var skip = startPage * limitPage;
  }

  // ถ้าไม่มีการ Search
  if (Object.keys(req.query).length <= 2) {

    File
      .find()
      .exec()
      .then(items => {
        const totalItem = items.length;
        File
          .find()
          .populate('user', 'firstname lastname email')
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
  } else if(Object.keys(req.query).length==3){ // มีการ Search
    const data = File.find({
      // name: '87932923_182383563044456_2295530797030965248_n.jpg'
      // "name": '87932923_182383563044456_2295530797030965248_n.jpg'
      "user" : valueData
      
    }).populate('user', 'firstname lastname email')

    data.then(items => {
      const totalItem = items.length;
      data
        .skip(Number(skip))
        .limit(Number(limitPage))
        .then(item => {
          return res.status(200).json({
            totalItems: totalItem,
            items: item
          })
        })
    })
  }
})

// delete
  router.delete("/:name/:id", (req, res, next) => {
    const name = req.params.name;
    const id= req.params.id

    File.remove({
      user: id,
      name: name
    })
    .exec()
    .then(
      res.status(200).json({
        message: 'File is deleted'
      })
    )
  })

module.exports = router;