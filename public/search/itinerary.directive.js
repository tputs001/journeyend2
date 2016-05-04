var app = angular.module('suggest')

app.directive('itinerary', itinerary);
function itinerary(){
  return {
    templateUrl: 'search/itinerary.directive.html'
  }
}
