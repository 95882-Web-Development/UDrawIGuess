var express = require('express');
var router = express.Router();
var pictures = [
    {id: 101, title: "Fight", answer: "a101", description: "good", url:"aaa.jpg", viewNum:99, likeNumber:100},
    {id: 102, title: "Club", answer: "a102", description: "better", url:"bb.jpg", viewNum:99, likeNumber:100},
    {id: 103, title: "Fight Club", answer: "a103", description: "bad", url:"cc.jpg", viewNum:99, likeNumber:100},
    {id: 104, title: "Fight Club", answer: "a104", description: "cc", url:"dd.jpg", viewNum:99, likeNumber:100},
];

router.get('/', function(req, res){
    res.json(pictures);
});

router.get('/:id([0-9]{3,})', function(req, res){
    var currPicture = pictures.filter(function(picture){
        if(picture.id == req.params.id){
            return true;
        }
    });
    if(currPicture.length == 1){
        res.json(currPicture[0])
    }
    else{
        res.status(404);//Set status to 404 as movie was not found
        res.json({message: "Not Found"});
    }
});

router.post('/', function(req, res){
    //Check if all fields are provided and are valid:
    if(!req.body.title || !req.body.url){
        res.status(400);
        res.json({message: "Bad Request"});
    }
    else{
        var newId = pictures[pictures.length-1].id+1;
        movies.push({
            id: newId,
            title: req.body.title,
            description: req.body.description,
            url: req.body.url
        });
        res.json({message: "New movie created.", location: "/movies/" + newId});
    }
});

router.delete('/:id', function(req, res){
    var removeIndex = pictures.map(function(movie){
        return movie.id;
    }).indexOf(req.params.id); //Gets us the index of movie with given id.
    if(removeIndex === -1){
        res.json({message: "Not found"});
    }else{
        pictures.splice(removeIndex, 1);
        res.send({message: "Movie id " + req.params.id + " removed."});
    }
});

module.exports = router;