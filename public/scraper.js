var request = require('request');
var cheerio = require('cheerio');

function scrape(url, location, name, activity, database, db){
  var yelp = url
  var name = name
  var priceLegend = {
    $ : 5,
    $$ : 18,
    $$$ : 35,
    $$$$ : 75
  }

  if(activity == "hiking" || activity == "museums"){
    return "Not Available";
  }
  request(yelp, function(error, response, body) {
     if(response.statusCode === 200) {
       var $ = cheerio.load(body)
       var yelpPrice;
       var getElement = ($('.price-category > .bullet-after > .price-range').text()).trim()
       getElement == "" ? yelpPrice = "Not Available" : yelpPrice = priceLegend[getElement]
       var objectName = {}
       var objectPrice = {}
       objectName[activity + '.title'] = name
       objectPrice[activity + '.$.price'] = yelpPrice
       database.update(objectName, {$set: objectPrice}, function(error, results){
         console.log(objectName)
         console.log(getElement)
       })
     }
  });
}
module.exports.scrape = scrape
