var express = require('express');
var bodyParser =require('body-parser').json()
var mongo = require('mongodb')
var request = require('request');
var yelp = require('./public/yelp');
var scraper = require('./public/scraper')
var myClient = mongo.MongoClient;
var url = process.env.MONGODB_URI ==  undefined ? 'mongodb://localhost/suggest' : process.env.MONGODB_URI
var app = express();

app.use(express.static('./public'))

app.get('/search/:query', function(req, res){
  var location = req.params.query
  myClient.connect(url, function(err, db){
    var database = db.collection('activities')
    database.findOne({'location' : location}, function(err, results){
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
            var num = (bodyParsed.activities[i].fromPrice)
            var cost = parseInt(num.slice(1, num.length))
            titleArray.push({
              title : bodyParsed.activities[i].title,
              id : bodyParsed.activities[i].id,
              url : bodyParsed.activities[i].imageUrl,
              price : cost,
              categories : bodyParsed.activities[i].categories,
              latlng : bodyParsed.activities[i].latLng
            })
          }
          database.insert({
            location : location,
            tours : titleArray
          }, function(error, results){
            res.send(titleArray)
            populateData(location, database, db)
          })
        })
      } else {
        res.send(results)
      }
    })
  })
})

function populateData(location, database, db){
  database.findOne({'location': location}, function(error, results){
    var activities = ['hiking', 'restaurants', 'nightlife', 'museums']
    for(var i = 0; i<activities.length; i++){
     yelp.yelpSearch(activities[i], location, database, db)
    }
  })
}

app.get('/hikes/:query/', function(req, res){
  var term = "hiking"
  var location = req.params.query
  grabData(location, res, term)
})

app.get('/restaurant/:query', function(req, res){
  var location = req.params.query
  var term = "restaurants"
  grabData(location, res, term)
})

app.get('/nightlife/:query', function(req, res){
  var location = req.params.query
  var term = "nightlife"
  grabData(location, res, term)
})

app.get('/museums/:query', function(req, res){
  var location = req.params.query
  var term = "museums"
  grabData(location, res, term)
})

app.get('/itinerary/:query', function(req, res){
  var location = req.params.query
  myClient.connect(url, function(err, db){
    var database = db.collection('activities')
    database.findOne({location: location}, function(error, results){
      res.send(results)
      db.close()
    })
  })
})


function grabData(location, res, term){
  myClient.connect(url, function(err, db){
    var database = db.collection('activities')
    database.findOne({location: location}, function(err, results){
      res.send(results[term])
      db.close()
    })
  })
}

var port = process.env.PORT || 1337;
app.listen(port, function(){ console.log("Listening on port " + port)})
