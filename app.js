var express = require('express');
var bodyParser =require('body-parser').json()
var mongo = require('mongodb')
var myClient = mongo.MongoClient;
var url = 'mongodb://localhost/journeysend'
var app = express();

app.use(express.static('./public'))

var server = app.listen(1337, function(){console.log("listening to 1337")})

app.get('/search/:query', function(req, res){
  var query = req.params.query
  myClient.connect(url, function(err, db){
    var data = db.collection('guides')
    data.findOne({'name' : query}, function(err, results){
      res.send(results)
    })
  })
})
