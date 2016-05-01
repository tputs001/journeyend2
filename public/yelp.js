var Yelp = require('yelp');
var mongo = require('mongodb');
var myClient = mongo.MongoClient;
var url = 'mongodb://localhost/suggest';

var yelp = new Yelp({
  consumer_key: 'iVRaq62BNmKycl-Oayfqfw',
  consumer_secret: '5e3V3EWsNeIQEP1rs8FnEXzuyB0',
  token: '1Q66AzpzcwsEh-2d9-0nVSSLH7Hhqbbt',
  token_secret: 'M2jy7kGubtwodQSaGOUmCqEaESw'
})

function yelpSearch(term, location){
  return yelp.search({
    location: location,
    sort: 2,
    category_filter: term,
  })
}

module.exports.yelpSearch = yelpSearch
