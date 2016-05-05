var Yelp = require('yelp');
var scraper = require('./scraper')

var yelp = new Yelp({
  consumer_key: 'iVRaq62BNmKycl-Oayfqfw',
  consumer_secret: '5e3V3EWsNeIQEP1rs8FnEXzuyB0',
  token: '1Q66AzpzcwsEh-2d9-0nVSSLH7Hhqbbt',
  token_secret: 'M2jy7kGubtwodQSaGOUmCqEaESw'
})

function createData(data, location, activity, database, db){
  var activityArray = []
  for(var i = 0; i<data.businesses.length; i++){
    var img_url = data.businesses[i].image_url
    var newUrl;
    img_url == undefined ? newUrl = "Not Available" : newUrl = img_url.slice(0, img_url.indexOf('/ms')) + '/o.jpg'
    activityArray.push({
      title : data.businesses[i].name,
      id : data.businesses[i].id,
      url : newUrl,
      price : scraper.scrape(data.businesses[i].url, location, data.businesses[i].name, activity, database, db),
      categories : data.businesses[i].categories,
      latlng : data.businesses[i].location.cordinate,
      location : data.businesses[i].location,
      rating : data.businesses[i].rating,
      review: data.businesses[i].review_count,
      snippet: data.businesses[i].snippet_text,
      phone : data.businesses[i].phone
    })
  }
  return activityArray;
}

function yelpSearch(term, location, database, db){
  yelp.search({
    location: location,
    sort: 2,
    category_filter: term,
  })
  .then(function(data){
    var yelpData = createData(data, location, term, database, db)
    var setObject = {}
    setObject[term] = yelpData
    database.update(
      { 'location' : location},
      { $set:
        setObject
      }, function(error, results){
      }
    )
  })
}

module.exports.yelpSearch = yelpSearch
