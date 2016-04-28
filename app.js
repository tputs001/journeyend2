var express = require('express');
var bodyParser =require('body-parser').json()
var mongo = require('mongodb')
var request = require('request');
var myClient = mongo.MongoClient;
var url = 'mongodb://localhost/journeysend'
var app = express();

app.use(express.static('./public'))

app.get('/search/:query', function(req, res){
  var location = req.params.query
  myClient.connect(url, function(err, db){
    var data = db.collection('activities')
    data.findOne({'location' : location}, function(err, results){
      if(results == null){
        request({
          url: 'http://terminal2.expedia.com/x/activities/search',
          qs: {
                location: location,
                apikey: 'yWk7WboSDIGIl8tiJJ4fnrnx0vUCsEVz'
              }
        }, function(error, response, body){
          var titleArray =[]
          var bodyParsed = JSON.parse(body)
          for(var i =0; i<bodyParsed.activities.length; i++){
            titleArray.push({
              title : bodyParsed.activities[i].title,
              id : bodyParsed.activities[i].id,
              url : bodyParsed.activities[i].imageUrl,
              price : bodyParsed.activities[i].fromPrice,
              categories : bodyParsed.activities[i].categories,
              latlng : bodyParsed.activities[i].latLng
            })
          }
          data.insert({
            location : location,
            activities : titleArray
          }, function(error, results){
            res.send(titleArray)
          })
        })
      } else {
        res.send(results)
      }
    })
  })
})
var server = app.listen(1337, function(){console.log("listening to 1337")})
