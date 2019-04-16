var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var csrfProtection = csrf();

var MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://medi-core:ucsc@123@medi-core-t8h1d.mongodb.net/test?retryWrites=true";
// router.use(csrfProtection);

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('login', {csrfToken: req.csrfToken()});
});

router.get('/dashboard', function (req, res, next) {
    getPublicPosts(function(err, name) {
        res.render('home/home');
    });
});

router.post('/posts/add', function (req, res, next) {
    const description = req.body.problemDescription;
    backURL=req.header('Referer') || '/';

    var error;

    MongoClient.connect(uri, { useNewUrlParser: true } , function(err, db) {
        if (err) throw err;

        var dbo = db.db("medicore");

        var myobj = {
            problem_description: description,
        };

        dbo.collection("public_posts").insertOne(myobj, function(err){
            if (err){
                error = "Ops! Error... Please Try again";
            }else{
                error = "Query submitted Successfully";
                db.close();
                res.redirect(backURL);
            }
        });
    });
});

function getPublicPosts(callback){
    MongoClient.connect(uri, { useNewUrlParser: true } , function(err, db) {
        if (err) throw err;

        var dbo = db.db("medicore");

        dbo.collection("public_posts").find( function(err, objs){
            if(err) cb(err);

            if (objs.length != 0) {
                console.log(objs);
                return callback(null, objs);
            } else {
                // Not sure what you want to do if there are no results
            }
        });
    });
}

module.exports = router;
