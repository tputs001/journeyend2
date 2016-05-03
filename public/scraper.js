var request = require('request');
var cheerio = require('cheerio');
var mongo = require('mongodb')
var myClient = mongo.MongoClient;
var mongoUrl = 'mongodb://localhost/suggest'

function scrape(url, location, name, activity){
  var yelp = url
  var name = name
  var priceLegend = {
    $ : 5,
    $$ : 18,
    $$$ : 35,
    $$$$ : 75
  }
  request(yelp, function(error, response, body) {
     if(response.statusCode === 200) {
       var $ = cheerio.load(body)
       var yelpPrice;
       var getElement = ($('.price-category > .bullet-after > span').text()).trim()
       getElement == "" ? yelpPrice = "Not Available" : yelpPrice = priceLegend[getElement]
       myClient.connect(mongoUrl, function(err, db){
         var database = db.collection('activities')
         var objectName = {}
         var objectPrice = {}
         objectName[activity + '.title'] = name
         objectPrice[activity + '.$.price'] = yelpPrice
        database.update(objectName, {$set: objectPrice})
       })
     }
  });
}
module.exports.scrape = scrape
