var express = require('express');
var bodyParser =require('body-parser').json()
var mongo = require('mongodb')
var request = require('request');
var yelp = require('./public/yelp');
var scraper = require('./public/scraper')
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
    var activityArray = insert(data, location, "hiking", res)
    getData(location, res, term, activityArray)
  })
})

app.get('/restaurant/:query', function(req, res){
  var location = req.params.query
  var term = "restaurants"
    var results = yelp.yelpSearch(term, location)
    results.then(function(data){
      var activityArray = insert(data, location, "restaurants", res)
      getData(location, res, term, activityArray)
    })
})

app.get('/nightlife/:query', function(req, res){
  var location = req.params.query
  var term = "nightlife"
  var results = yelp.yelpSearch(term, location)
  results.then(function(data){
    var activityArray = insert(data, location, "nightlife", res)
    getData(location, res, term, activityArray)
  })
})

app.get('/museums/:query', function(req, res){
  var location = req.params.query
  var term = "museums"
  var results = yelp.yelpSearch(term, location)
  results.then(function(data){
    var activityArray = insert(data, location, "museums", res)
    getData(location, res, term, activityArray)
  })
})

function insert(data, location, activity, res){
  var activityArray = []
  for(var i = 0; i<data.businesses.length; i++){
    var img_url = data.businesses[i].image_url
    var newUrl;
    if(img_url == undefined){
      newUrl = "Not Available"
    } else {
      newUrl = img_url.slice(0, img_url.indexOf('/ms')) + '/o.jpg'
    }
    activityArray.push({
      title : data.businesses[i].name,
      id : data.businesses[i].id,
      url : newUrl,
      price : scraper.scrape(data.businesses[i].url, location, data.businesses[i].name, activity),
      categories : data.businesses[i].categories,
      latlng : data.businesses[i].location.cordinate,
      location : data.businesses[i].location,
      rating : data.businesses[i].rating,
      phone : data.businesses[i].phone
    })
  }
  return activityArray;
}

function getData(location, res, terms, activityArray){
  myClient.connect(url, function(err, db){
    var database = db.collection('activities')
    database.findOne({location: location}, function(error, results){
      var setObject = {}
      setObject[terms] = activityArray
      if(results[terms] == undefined || results[terms] == null){
        database.update(
          {'location' : location},
          { $set:
            setObject
          }, function(error, results){
            res.send(activityArray)
          }
        )
      } else {
        res.send(results[terms])
      }
    })
  })
}

var server = app.listen(1337, function(){console.log("listening to 1337")})
