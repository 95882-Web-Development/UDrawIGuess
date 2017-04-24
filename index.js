var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer();
var app = express();
app.use(express.static('public'));
app.use(express.static('images'));
app.set('view engine', 'pug');
app.set('views','./views');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(upload.array()); // for parsing multipart/form-data
app.use(express.static('public'));

app.get('/first_template', function(req, res){
    res.render('first_view');
});

app.get('/form', function(req, res){
    res.render('form');
});

// var things = require('./things.js');
//
// //Simple request time logger
// app.use('/things',function(req, res, next){
//     console.log("A new request received at " + Date.now());
//     //This function call is very important. It tells that more processing is
//     //required for the current request and is in the next middleware function/route handler.
//     next();
// });
//
// app.use('/things',things);
//
// app.get('/things/:name/:id', function(req, res){
//     res.send('id: ' + req.params.id + ' and name: ' + req.params.name);
// });


app.post('/', function(req, res){
    console.log(req.body);
    res.send("recieved your request!");
});

app.get('*', function(req, res){
    res.send('Sorry, this is an invalid URL.');
});

app.listen(3000);