var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var multer = require('multer');
var upload = multer();
var app = express();
app.use(express.static('public'));
app.use(express.static('images'));

app.set('view engine', 'ejs');
app.set('views','./views');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: true })); // for parsing application/x-www-form-urlencoded
app.use(upload.array()); // for parsing multipart/form-data
app.use(express.static('public'));
app.use(cookieParser());
app.use(session({secret: "chenjiasen"}));

var pictures = require('./pictures.js');

app.use('/pictures', pictures);

var Users = [];
app.get('/signup', function(req, res){
    res.render('signup');
});

app.post('/signup', function(req, res){
    if(!req.body.username || !req.body.password || !req.body.email){
        res.status("400");
        res.send("Invalid details!");
    }
    else{
        Users.filter(function(user){
            if(user.username === req.body.username){
                res.render('signup', {message: "User Already Exists! Login or choose another user id"});
            }
        });
        var newUser = {username: req.body.username, password: req.body.password, email: req.body.email};
        Users.push(newUser);
        req.session.user = newUser;
        res.redirect('/protected_page');
    }
});

function checkSignIn(req, res){
    if(req.session.user){
        next();     //If session exists, proceed to page
    } else {
        var err = new Error("Not logged in!");
        console.log(req.session.user);
        next(err);  //Error, trying to access unauthorized page!
    }
}

app.get('/protected_page', checkSignIn, function(req, res){
    res.render('protected_page', {username: req.session.user.username})
});


app.get('/login', function(req, res){
    res.render('login');
});

app.post('/login', function(req, res){
    console.log(Users);
    if(!req.body.username || !req.body.password){
        res.render('login', {message: "Please enter both id and password"});
    }
    else{
        Users.filter(function(user){
            if(user.username === req.body.username && user.password === req.body.password){
                req.session.user = user;
                res.redirect('/protected_page');
            }
        });
        res.render('login', {message: "Invalid credentials!"});
    }
});

app.get('/logout', function(req, res){
    req.session.destroy(function(){
        console.log("user logged out.")
    });
    res.redirect('/login');
});

app.use('/protected_page', function(err, req, res, next){
    console.log(err);
    //User should be authenticated! Redirect him to log in.
    res.redirect('/login');
});
//
//
// app.get('/',function(req, res){
//     Picture.find(function(err, result){
//        if(err) return console.log(err);
//         console.log(result);
//         res.render('index.ejs',{quotes:result});
//     });
// })
//
// app.get('/person', function(req, res){
//     res.render('person');
// });
//
// app.post('/submitPicture', function(req, res){
//     var pictureInfo = req.body; //Get the parsed information
//     if(!pictureInfo.title || !pictureInfo.answer || !pictureInfo.url){
//         res.render('show_message.ejs', {message: "Sorry, you provided worng info", type: "error"});
//     } else {
//         var newPicture = new Picture({
//             title: pictureInfo.title,
//             answer: pictureInfo.answer,
//             url: pictureInfo.url
//         });
//
//         newPicture.save(function(err, Picture){
//             if(err)
//                 res.redirect('/');
//             else
//                 res.redirect('/');
//         });
//     }
// });

app.post('/person', function(req, res){
    var personInfo = req.body; //Get the parsed information
    if(!personInfo.name || !personInfo.age || !personInfo.nationality){
        res.render('show_message', {message: "Sorry, you provided worng info", type: "error"});
    } else {
        var newPerson = new Person({
            name: personInfo.name,
            age: personInfo.age,
            nationality: personInfo.nationality
        });

        newPerson.save(function(err, Person){
            if(err)
                res.render('show_message', {message: "Database error", type: "error"});
            else
                res.render('show_message', {message: "New person added", type: "success", person: personInfo});
        });
    }
});

var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/my_db");

var pictureScheme = mongoose.Schema({
    title: String,
    answer: String,
    url: String,

});

var Picture = mongoose.model("Picture", pictureScheme);

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