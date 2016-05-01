var express = require('express');
var bodyParser =require('body-parser').json()
var mongo = require('mongodb')
var request = require('request');
var yelp = require('./public/yelp');
var myClient = mongo.MongoClient;
var url = 'mongodb://localhost/suggest'
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
          data.insert({
            location : location,
            tours : titleArray
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

app.get('/hikes/:query/', function(req, res){
  var term = "hiking"
  var location = req.params.query
  var results = yelp.yelpSearch(term, location)
  results.then(function(data){
    insert(data, location, "hiking", res)
  })
})

app.get('/restaurant/:query', function(req, res){
  var location = req.params.query
  var term = "restaurants"
  var results = yelp.yelpSearch(term, location)
  results.then(function(data){
    insert(data, location, "restaurants", res)
  })
})

app.get('/museums/:query', function(req, res){
  var location = req.params.query
  var term = "museums"
  var results = yelp.yelpSearch(term, location)
  results.then(function(data){
    insert(data, location, "museums", res)
  })
})

function insert(data, location, activity, res){
  var activityArray = []
  for(var i = 0; i<data.businesses.length; i++){
    var img_url = data.businesses[i].image_url
    var newUrl = img_url.slice(0, img_url.indexOf('/ms')) + '/o.jpg'
    activityArray.push({
      title : data.businesses[i].name,
      id : data.businesses[i].id,
      url : newUrl,
      price : 0,
      categories : data.businesses[i].categories,
      latlng : data.businesses[i].location.cordinate,
      location : data.businesses[i].location,
      rating : data.businesses[i].rating,
      phone : data.businesses[i].phone
    })
  }

  myClient.connect(url, function(err, db){
    var database = db.collection('activities')
    database.update(
      {'location' : location},
      { $set:
        {
          activity : activityArray
        }
      }, function(error, results){
        res.send(activityArray)
      }
    )
  })
}

var server = app.listen(1337, function(){console.log("listening to 1337")})
