const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


// ไปดึง MONGO_PW มาจาก nodemon.json
mongoose.connect(
    // process.env.MONGODB_URI, {
    'mongodb+srv://ketar:' + process.env.MONGO_ATLAS_PW + '@internship-sblpt.gcp.mongodb.net/intern?retryWrites=true&w=majority', {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .then(result => {
        console.log("Connected to MongoDB...");
    })
    .catch(err=> {
        console.log("Cann't connect MongoDB")
    })

mongoose.Promise = global.Promise;

//แสดง เวลาในการ GET POST ลงใน TERMINAL ด้านล่าง
app.use(morgan('dev'));
app.unsubscribe(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
  });

const UserRoute = require('./api/routes/user')

//Route Handle
 app.use('/user', UserRoute);


//กรณีหา Route ไม่เจอ Set ERROR
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

//Response Error
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            messageb: "Ressponse error -> Tar",
            message: error.message,
        }
    });
});



module.exports = app;