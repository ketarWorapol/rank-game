const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Academy = require('../models/observe/observe_teaching');

var accessToken = null;

const flag = 1; // เปิดครั้งแรก
let dummy;

// GET ALL USER
router.get('/', (req, res, next) => {
	if (!req.query["sp"] || !req.query["lp"]) {
		res.status(200).json({
		  code: "Error !",
		  message: "Missing request query parameter",
		});
	  }
	
	  var sp = Object.values(req.query["sp"]);
	  var lp = Object.values(req.query["lp"]);
	  var skip = sp * lp;

	  var valueData = req.query["search"];
	
	  const user = User.find({
		$or: [{
			firstname: {
			  $regex: valueData,
			  $options: "ig",
			},
		  },
		  {
			lastname: {
			  $regex: valueData,
			  $options: "ig",
			},
		  },
		  {
			username: {
			  $regex: valueData,
			  $options: "ig",
			},
		  },
		],
	  }).sort({
		firstname: 0
	  })
	  .select('firstname lastname classroom year detail updated');
	
	  user.then((result) => {
		const totalItem = result.length;
		user
		  .skip(Number(skip))
		  .limit(Number(lp))
		  .then((items) => {
			return res.status(200).json({
			  total_items: totalItem,
			  items: items,
			});
		  })
		  .catch((err) => {
			res.status(500).json({
			  message: err.message,
			});
		  });
	  });
})

router.get('/')

//CREATE USER
router.post("/signup", (req, res, next) => {
	console.log(req.body.place)
	User.find({
			email: req.body.email
		})
		.exec()
		.then(user => {
			if (user.length >= 1) {
				return res.status(409).json({
					message: "มีอีเมล์ดังกล่าวอยู่ในระบบแล้ว"
				});
			} else {
				bcrypt.hash(req.body.password, 10, (err, hash) => {
					if (err) {
						return res.status(500).json({
							message: "last update 05:23",
							error: err
						});
					} else {
						const user = new User({
							_id: new mongoose.Types.ObjectId(),
							email: req.body.email,
							password: hash,
							firstname: req.body.firstname,
							lastname: req.body.lastname,
							position: req.body.position,
							image: req.body.image,
							role: 1,
							year: req.body.year
						});
						user
							.save()
							.then(result => {
								// console.log(result);
								res.status(201).json({
									message: "User created"
								});
							})
							.catch(err => {
								console.log(err);
								res.status(500).json({
									error: err
								});
							});
					}
				});
			}
		});
});

//Get Data BY user ID
router.get('/data', (req, res, next) => {
	jwt.verify(accessToken, process.env.JWT_KEY, function (error, decodedToken) {
		console.log(decodedToken.userId);
		const userId = decodedToken.userId;
		return User.findById({
				_id: userId
			})
			.select("position role email firstname lastname year created updated image")
			// .exec()
			.then(UserLogin => {
				return res.status(200).json(UserLogin);
			})
	})
})

router.get('/:userId', (req, res, next) => {
	const userId = req.params.userId;
	return User.findById({
			_id: userId
		})
		.populate('academy')
		.then(UserLogin => {
			return res.status(200).json(UserLogin);
		})
})

// change password 
router.patch('/change_password', (req, res, next) => {
	// req.body.old_pass = 555;
  
	jwt.verify(accessToken, process.env.JWT_KEY, function (error, decodedToken) {
	  const userId = decodedToken.userId;
	  const old_pass = req.body.old_pass;
	  const new_pass = req.body.new_pass;
  
  
	  User.findById({
		  _id: userId
		})
		.then(user => {
  
		  const password_in_db = user.password;
		  bcrypt.compare(old_pass, password_in_db, (err, result) => {
			if (!result) {
			  return res.status(401).json({
				message: "รหัสผ่านเดิมไม่ถูกต้อง"
			  });
			} else
			  // กรณีรหัสผ่านเก่าถูกแก้ไขรหัสผ่านได้
			  bcrypt.hash(new_pass, 10, (err, hash) => {
				if (err) {
				  return res.status(500).json({
					error: err
				  });
				} else {
				  User.update({
					  _id: userId
					}, {
					  password: hash
					})
					.exec()
					.then(res.status(200).json({
					  message: "แก้ไขรหัสผ่านเสร็จสิ้น"
					}));
				}
			  });
  
  
		  });
		})
		.catch(error => {
		  return res.status(500).json({
			message: error.name,
			err: error
		  })
		})
	})
  })

  // Update Data
router.patch("/:userId", (req, res, next) => {
	const id = req.params.userId;
	console.log(id)
	User.update({
		_id: id
	  }, {
		$set: req.body
	  })
	  .exec()
	  .then(result => {
		res.status(200).json({
		  message: "แก้ไขข้อมูลสำเร็จ",
		})
	  })
	  .catch(err => {
		res.status(500).json({
		  message: err.name,
		  message2: "WTF"
		})
	  })
  });

//Login
router.post("/login", (req, res, next) => {
	User.find({
			email: req.body.email
		})
		.exec()
		.then(user => {
			if (user.length < 1) {
				return res.status(401).json({
					message: "อีเมล์ หรือพาสเวิร์ดไม่ถูกต้อง"
				});
			}
			bcrypt.compare(req.body.password, user[0].password, (err, result) => {
				if (err) {
					return res.status(401).json({
						message: "อีเมล์ หรือพาสเวิร์ดไม่ถูกต้อง"
					});
				}
				if (result) {
					const token = jwt.sign({
							email: user[0].email,
							userId: user[0]._id
						},
						process.env.JWT_KEY, {
							expiresIn: "1h"
						}
					);
					accessToken = token;

					User.update({
						_id: user[0]._id
					  }, {
						updated: new Date
					  })
					  .exec()

					return res.status(200).json({
						message: "Auth successful",
						userId: user[0]._id,
						accessToken: token
					});
				}
				res.status(401).json({
					message: "อีเมล์ หรือพาสเวิร์ดไม่ถูกต้อง"
				});
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});

// Delete User
router.delete('/:userId', (req, res, next) => {
	User.remove({
		_id: req.params.userId
  
	  })
	  .exec()
	  .then(result => {
		res.status(200).json({
		  message: 'User is deleted'
		})
		console.log("User is deleted")
	  })
	  .catch(err => {
		res.status(500).json({
		  message: err.name,
		  error: err
		})
	  })
  })
module.exports = router;